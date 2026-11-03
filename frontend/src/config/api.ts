/**
 * ChopSnap API Client Configuration
 * Centralized endpoint definition for local development and cloud production.
 */

if (
  typeof window !== "undefined" &&
  process.env.NODE_ENV === "production" &&
  !process.env.NEXT_PUBLIC_API_URL
) {
  console.warn(
    "[ChopSnap] Startup Warning: NEXT_PUBLIC_API_URL is missing in production build. Falling back to default http://localhost:8000."
  );
}

export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
