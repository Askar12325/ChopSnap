import time
from datetime import datetime, timezone
from typing import Dict, List
from fastapi import Request, HTTPException, status
from ..config import settings

# Per-IP sliding window timestamps: {client_ip: [timestamp1, timestamp2, ...]}
_IP_REQUEST_TIMESTAMPS: Dict[str, List[float]] = {}

# Global daily live AI calls counter: {utc_date_str: count}
_DAILY_AI_CALLS: Dict[str, int] = {}

def get_client_ip(request: Request) -> str:
    """
    Extracts the true client IP behind reverse proxies/load balancers.
    Reads the first comma-separated address from X-Forwarded-For,
    falling back to direct request.client.host if absent.
    """
    xff = request.headers.get("x-forwarded-for")
    if xff:
        client_ip = xff.split(",")[0].strip()
        if client_ip:
            return client_ip
    if request.client and request.client.host:
        return request.client.host
    return "127.0.0.1"

def check_ip_rate_limit(request: Request) -> None:
    """
    Enforces a sliding window rate limit per visitor IP.
    Each distinct client IP maintains its own private bucket.
    """
    ip = get_client_ip(request)
    now = time.time()
    window_seconds = 60.0
    limit = settings.RATE_LIMIT_PER_MINUTE

    # Retrieve and clean past timestamps outside the 60s sliding window
    timestamps = _IP_REQUEST_TIMESTAMPS.get(ip, [])
    active_timestamps = [t for t in timestamps if (now - t) < window_seconds]

    if len(active_timestamps) >= limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please slow down and try again in a moment.",
            headers={"Retry-After": "30"},
        )

    active_timestamps.append(now)
    _IP_REQUEST_TIMESTAMPS[ip] = active_timestamps

    # Periodic cleanup of inactive IPs (older than 2 minutes)
    if len(_IP_REQUEST_TIMESTAMPS) > 1000:
        stale_threshold = now - 120.0
        stale_ips = [k for k, v in _IP_REQUEST_TIMESTAMPS.items() if not v or v[-1] < stale_threshold]
        for k in stale_ips:
            _IP_REQUEST_TIMESTAMPS.pop(k, None)

def check_and_increment_daily_ai_cap() -> None:
    """
    Enforces a global daily ceiling on live AI calls across all users to preserve credits.
    Only called for live AI requests (not health checks, static routes, or demo/example flows).
    Resets automatically at 00:00 UTC each day.
    """
    today_utc = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    current_count = _DAILY_AI_CALLS.get(today_utc, 0)
    cap = settings.DAILY_AI_CALL_LIMIT

    if current_count >= cap:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Demo limit reached for today. Try an example scenario to explore recipes!",
            headers={"Retry-After": "3600"},
        )

    _DAILY_AI_CALLS[today_utc] = current_count + 1

    # Purge old date entries
    old_dates = [d for d in _DAILY_AI_CALLS if d != today_utc]
    for d in old_dates:
        _DAILY_AI_CALLS.pop(d, None)
