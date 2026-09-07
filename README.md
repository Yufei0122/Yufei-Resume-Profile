# Yufei Resume Profile

Personal portfolio built with Vite and vanilla JavaScript, with a desktop Three.js hero, a mobile card presentation, and a Leaflet experience map.

The current website is a static application: content, images, PDFs, and map overview data are bundled with the frontend. It does not call the optional FastAPI prototype and requires no database or environment variables to deploy.

## Local development

Use Node.js **24.x** (also recorded in `.nvmrc`). Run commands from the repository root:

```bash
npm run setup
npm run dev
```

`setup` installs the exact dependencies in `frontend/package-lock.json`. The development server uses port 5173.

## Production validation

```bash
npm run build
npm run preview
```

The build checks local import spelling and case for Linux compatibility, runs the existing tests, compiles the frontend, and checks the generated assets for missing references, localhost endpoints, and source maps. Output is `frontend/dist`; the preview server uses port 4173.

Additional commands:

```bash
npm run check
npm test
npm --prefix frontend audit
```

The desktop 3D scene and experience map load on demand. Their larger chunks may produce Vite size warnings; these do not prevent deployment.

## Deploy to Vercel

Commit and push all required source files, assets, configuration, scripts, tests, and `frontend/package-lock.json` to GitHub before importing the repository into Vercel. New, untracked files must also be included. Do not commit `.env`, `node_modules`, `dist`, or `.vercel`.

| Setting | Value |
| --- | --- |
| Root Directory | Repository root (`.`); leave the default |
| Framework Preset | Vite |
| Node.js Version | 24.x |
| Install Command | `npm run setup` |
| Build Command | `npm run build` |
| Output Directory | `frontend/dist` |
| Environment Variables | None required |

`vercel.json` supplies the install command, build command, output directory, and cache/security headers. The root `package.json` pins the Node.js major version. Select the repository root, **not** `frontend`, so Vercel uses this configuration and the validation scripts.

Navigation uses URL hashes, such as `/#projects` and `/#/lens/gis`. These URLs refresh at the site root and do not need a catch-all rewrite. Missing asset URLs should return 404.

See the [Chinese deployment guide](docs/deployment-vercel.md) for detailed steps and troubleshooting, and [Vercel's Vite documentation](https://vercel.com/docs/frameworks/frontend/vite) for platform details.

## Structure

```text
vercel.json                 Vercel build and response configuration
scripts/                    Import and production-output checks
frontend/src/               Website source, bundled content, and assets
frontend/tests/             Experience/map data regression tests
frontend/package-lock.json  Reproducible frontend dependency versions
frontend/dist/              Generated production site (not committed)
backend/                    Optional FastAPI prototype
docs/                       Architecture and deployment documentation
docker-compose.yml          Optional local backend/database infrastructure
```

Google Fonts and OpenStreetMap tiles are external browser requests. They require network access but no deployment secrets. The overview map data is bundled locally.

## Optional backend development

The retained FastAPI/MySQL scaffold is separate from the current static website and is excluded from Vercel uploads. It is not needed to run or deploy the portfolio.

To develop it separately on Windows:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
Copy-Item .env.example .env
python run.py
```

Configure `backend/.env` for the local API/database as needed. Run backend tests with `pytest`. Prototype endpoints are `GET /api/v1/health` and `GET /api/v1/profile`; Docker Compose remains available for local infrastructure.
