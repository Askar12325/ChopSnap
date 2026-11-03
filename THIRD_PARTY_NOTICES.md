# Third-Party Notices & Licenses

ChopSnap relies on open-source software, typography, and open-weight AI models. Each third-party component is covered by its respective published license.

---

## 1. AI Models & Serving Infrastructure

### Muse Spark Open
- **Copyright**: Copyright (c) 2026 Meta Platforms, Inc.
- **Model Identifier**: `meta-models/Muse-Spark-Open-816B-A42B` / `meta-models/muse-spark-open-1026`
- **Serving Platform**: Hosted on serverless inference via [Baseten](https://baseten.co) (`https://inference.baseten.co/v1`)
- **License**: [Muse Model License, Muse Spark Open](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B/blob/main/LICENSE.md)
- **Usage Policy**: [Exhibit A — Usage Policy](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B/blob/main/LICENSE.md)
- **Model Repository**: [https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B)
- **Attribution Notice**: Built with Muse Spark Open.

---

## 2. Typography & Fonts

ChopSnap loads the following fonts via `next/font/google` in `frontend/src/app/layout.tsx`:

| Font | Designer / Foundry | License | Source / Upstream |
|---|---|---|---|
| **Fraunces** (`--font-heading`) | Phaedra Charles & Flavia Zimbardi (Undercase Type) | SIL Open Font License, Version 1.1 | https://github.com/undercasetype/Fraunces |
| **Plus Jakarta Sans** (`--font-sans`) | Gumpita Rahayu (Tokotype) | SIL Open Font License, Version 1.1 | https://github.com/tokotype/Plus-Jakarta-Sans |

---

## 3. Frontend Libraries

The ChopSnap web application is built with the following open-source libraries:

| Component | License | Project URL |
|---|---|---|
| **Next.js** | MIT | https://github.com/vercel/next.js |
| **React & React DOM** | MIT | https://github.com/facebook/react |
| **Tailwind CSS** | MIT | https://github.com/tailwindlabs/tailwindcss |
| **Lucide Icons** | ISC | https://github.com/lucide-icons/lucide |
| **Framer Motion** | MIT | https://github.com/framer/motion |

---

## 4. Backend Libraries

The ChopSnap API backend is built with the following open-source Python packages:

| Package | License | Repository |
|---|---|---|
| **FastAPI** | MIT | https://github.com/fastapi/fastapi |
| **Uvicorn** | BSD-3-Clause | https://github.com/encode/uvicorn |
| **Pydantic & Pydantic-Settings** | MIT | https://github.com/pydantic/pydantic |
| **HTTPX** | BSD-3-Clause | https://github.com/encode/httpx |
| **Pillow** | HPND | https://github.com/python-pillow/Pillow |
| **python-multipart** | Apache-2.0 | https://github.com/andrew-d/python-multipart |
| **python-dotenv** | BSD-3-Clause | https://github.com/theskumar/python-dotenv |
