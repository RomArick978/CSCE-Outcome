# 📋 Project Status

| Field | Value |
|-------|-------|
| **Project Idea** | ControlBridge — AI-Powered Compliance Mapping Platform |
| **User Level** | developer |
| **Created** | 2026-05-19 |

---

## 🏗️ Stack

| Component | Status | Notes |
|-----------|--------|-------|
| **Frontend** | ✅ Complete | React + Vite, 4-tab SPA (Compliance Check, Policies, Frameworks, History) |
| **Backend** | ✅ Complete | Node.js/Express, port 3000, /health + /frameworks + /analyze + /upload |
| **Database** | ⬜ Not started | Not required — all framework data is in-memory |

---

## ✅ Completed Tasks

- [x] Rebuilt from Streamlit to React + Node.js following platform rules (2026-05-19)
- [x] Backend: Express API with /health, /frameworks, /analyze, /upload endpoints (2026-05-19)
- [x] Backend: All routes WITHOUT /api prefix (Traefik strips it) (2026-05-19)
- [x] Backend: Non-root Docker user, parameterized inputs, descriptive JSON errors (2026-05-19)
- [x] Frontend: React + Vite SPA with Dashboard, Analyzer, Frameworks, About tabs (2026-05-19)
- [x] Frontend: nginx.conf (production, no proxy_pass) + nginx.local.conf (local, with proxy) (2026-05-19)
- [x] Frontend: Security headers in nginx (server_tokens off, X-Frame-Options, etc.) (2026-05-19)
- [x] Frontend: Non-root Docker user (2026-05-19)
- [x] docker-compose.yml: frontend + backend only, nginx.local.conf volume mount (2026-05-19)
- [x] AI token read server-side only (never exposed to client) (2026-05-19)
- [x] File uploads processed in memory (multer memoryStorage) (2026-05-19)
- [x] Session expiry handled with apiFetch() wrapper (2026-05-19)

---

## 🔄 Currently In Progress

- [ ] Deployment to ECS

---

## � Deployment

| Field | Value |
|-------|-------|
| **Status** | ⬜ Not deployed |
| **URL** | https://controlbridge.vibe.intranet.cnb |
| **Last Deploy** | — |

---

## 🔐 Secrets Required

| GitHub Secret | Purpose |
|---------------|---------|
| `APP_OPENAI_KEY` | myGenAssist API token for AI analysis mode |

---

### Latest Session

**Date**: 2026-05-19

**Summary**: Migrated entire application from Streamlit (Python) to React + Node.js following platform rules. All .clinerules requirements implemented: correct API routing (no /api prefix in backend), health endpoints, non-root containers, security headers, memory-based file uploads, session expiry handling, descriptive JSON errors. Redesigned UI to 4-tab SPA: Compliance Check, Policies, Frameworks, History. Both containers verified healthy locally (frontend :8080, backend :3000).

**Next Steps**: Deploy with `git push` after whitelisting confirmation.
