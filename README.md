# Yufei-Resume-Profile

Full-stack resume profile product scaffold with:

- `frontend/`: Node.js + JavaScript using Vite
- `backend/`: Python using FastAPI with layered service architecture
- `mysql`: MySQL 8.4 via Docker Compose
- `docs/`: project architecture and product documentation

## Structure

```text
.
|-- docs/
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |-- components/
|   |   |-- config/
|   |   |-- pages/
|   |   |-- services/
|   |   `-- styles/
|-- backend/
|   |-- app/
|   |   |-- api/
|   |   |-- core/
|   |   |-- db/
|   |   |-- models/
|   |   |-- schemas/
|   |   `-- services/
|   `-- tests/
|-- docker-compose.yml
|-- .env.example
`-- package.json
```

## Product qualities

- Versioned backend API under `/api/v1`
- Separated frontend UI, config, page, and service layers
- Separated backend routing, schemas, services, and database modules
- Dockerfiles for backend and frontend
- Test entrypoint for backend API regression coverage
- Centralized documentation in `docs/architecture.md`

## Frontend setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend expects the backend at `http://localhost:8000` by default.

## Backend setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python run.py
```

## Backend tests

```bash
cd backend
.venv\Scripts\activate
pip install -r requirements-dev.txt
pytest
```

## MySQL setup

1. Copy the root env template:

```bash
copy .env.example .env
```

2. Start MySQL:

```bash
docker compose up -d
```

3. Start the API container if you want a fully containerized local stack:

```bash
docker compose up -d api
```

4. Set `backend/.env` `DATABASE_URL` to match the MySQL credentials from the root `.env`.

5. Keep `CORS_ORIGINS=http://localhost:5173` in `backend/.env` for local frontend development.

## Available endpoints

- `GET /api/v1/health`
- `GET /api/v1/profile`

## Notes

- No dependencies were installed automatically in this repository.
- The current backend is structured for growth into real models, persistence, and CRUD flows without reworking the folder layout.
