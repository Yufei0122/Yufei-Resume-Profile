# Architecture

## Product layout

- `frontend/`: browser application built with Vite and vanilla JavaScript
- `backend/`: FastAPI service with layered modules
- `docs/`: product and engineering documentation
- `docker-compose.yml`: local infrastructure entrypoint

## Backend layers

- `app/core/`: framework bootstrap and settings
- `app/api/`: versioned HTTP routing
- `app/services/`: business use-cases
- `app/schemas/`: API contracts
- `app/db/`: persistence and connectivity
- `tests/`: service-level regression coverage

## Frontend layers

- `src/app/`: application bootstrap
- `src/pages/`: page composition
- `src/components/`: reusable UI sections
- `src/services/`: API access
- `src/config/`: runtime environment access
- `src/styles/`: shared styling assets

## Delivery model

- Frontend serves the user-facing resume experience.
- Backend exposes versioned REST endpoints.
- MySQL is the system-of-record database.
- Docker Compose is the default local infrastructure workflow.

