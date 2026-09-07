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

### Home hero

At viewport widths up to 860px, `features/careerUniverse/careerUniverseMobile.js` renders a touch-friendly introduction with SVG illustrations and three horizontally scrollable discipline cards. Native CSS scroll snapping, buttons and arrow keys switch cards; there is no automatic cycling or WebGL dependency. Education details reuse the experience data. Reduced-motion preferences disable the entrance effect and animated card navigation.

The desktop Three.js scene and its scroll controller load dynamically above that breakpoint. Media-query changes switch presentations; ordinary viewport resizing updates the layout without recreating the scene. Late desktop imports are ignored after changing routes or presentations, and event listeners are removed during cleanup.

Mobile skill tags read every satellite label from the matching planet in `careerUniverseData.js`, sharing names and order with the desktop scene. Tags wrap within the existing card layout; importing this data does not load Three.js on mobile.

## Delivery model

- The current website is a static Vite application deployed to Vercel from `frontend/dist`.
- Content and assets are bundled locally. The active frontend does not import the prototype API client and requires no API, database, or environment variables.
- The root `vercel.json` defines installation, production build, output, and response headers; root `package.json` selects Node.js 24.x.
- Builds validate case-sensitive imports, run the existing frontend tests, and verify emitted asset references before deployment.
- Hash-based routes need no catch-all rewrite. Hashed assets receive immutable caching; the entry page revalidates.
- FastAPI, MySQL, and Docker Compose remain optional local prototypes, separate from this deployment.
- See [Vercel deployment instructions](deployment-vercel.md).

