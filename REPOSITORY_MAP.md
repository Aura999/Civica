# REPOSITORY MAP

Phase 1 audit artifact. Static source inspection only; runtime verification is not included.

## Top-level map

```text
.
|-- .git/                         Git metadata
|-- build/                        Generated CRA production build, do not edit manually
|-- node_modules/                 Installed dependencies, generated, do not edit manually
|-- public/                       CRA public assets and SPA redirect config
|-- server/                       Express backend
|-- src/                          React frontend source
|-- .editorconfig
|-- .env                          Local real env file, do not inspect or commit
|-- .gitignore
|-- .nvmrc
|-- .prettierignore
|-- package-lock.json
|-- package.json                  Frontend/root manifest
|-- prettier.config.js
|-- README.md
|-- tailwind.config.js
```

## Frontend source map

```text
src/
|-- index.js                      React root, Redux store, BrowserRouter, Toaster
|-- App.jsx                       Route tree and top-level auth rehydration
|-- App.css
|-- assets/                       Images, logos, timeline logos
|-- components/
|   |-- Common/                   Navbar, Footer, IconBtn, modals, ratings, slider, tabs
|   `-- core/                     Feature-oriented UI groups
|       |-- AboutPage/
|       |-- Auth/
|       |-- Catalog/
|       |-- ContactUsPage/
|       |-- Course/
|       |-- Dashboard/
|       |-- HomePage/
|       `-- ViewCourse/
|-- data/                         Static nav, footer, dashboard links, country codes, home data
|-- hooks/                        useOnClickOutside, useRouteMatch
|-- pages/                        Route-level pages
|-- reducer/index.js              Redux root reducer
|-- services/                     API connector, endpoint constants, API operation modules
|-- slices/                       Redux Toolkit slices
`-- utils/                        Shared formatting/rating/constants helpers
```

## Backend source map

```text
server/
|-- index.js                      Express app entry point
|-- package.json                  Backend manifest
|-- README.md
|-- .env                          Local real env file, do not inspect or commit
|-- .env.example                  Backend env example
|-- .gitignore
|-- config/                       database, cloudinary, razorpay setup
|-- controllers/                  Route handlers with business logic
|-- mail/templates/               HTML email templates
|-- middleware/auth.js            JWT auth and role middleware
|-- models/                       Mongoose models
|-- routes/                       Express route groups
|-- syncCategories.js             Standalone category sync script
`-- utils/                        image upload, mail sending, duration formatting
```

## Entry points

- Frontend entry point: `src/index.js`
  - Creates React root.
  - Builds Redux store with `configureStore`.
  - Wraps `App` in `Provider`, `BrowserRouter`, and `Toaster`.
- Frontend route entry: `src/App.jsx`
  - Defines all React Router routes.
  - Rehydrates user details from `localStorage` token through Redux thunk.
- Backend entry point: `server/index.js`
  - Loads Express middleware.
  - Registers route groups under `/api/v1`.
  - Connects database and starts HTTP listener.

## Package manifests

- Root/frontend manifest: `package.json`
  - Name: `studynotion-client`
  - Scripts:
    - `start`: `react-scripts start`
    - `build`: `react-scripts build`
    - `test`: `react-scripts test`
    - `eject`: `react-scripts eject`
    - `server`: `cd server && npm run dev`
    - `dev`: runs frontend and backend concurrently
- Backend manifest: `server/package.json`
  - Name: `studynotion-backend`
  - Scripts:
    - `start`: `node index.js`
    - `dev`: `nodemon index.js`

## Deployment-related files

- `public/_redirects`: SPA fallback rule.
- `build/`: local generated CRA build output; ignored by root `.gitignore`.
- No app-level `vercel.json`, `netlify.toml`, `render.yaml`, `Procfile`, `railway.json`, `fly.toml`, Dockerfile, or Docker Compose file was found outside dependency folders.

## Environment-related files

- Found tracked example: `server/.env.example`.
- Found local real env files: `.env`, `server/.env`; do not inspect, print, or commit.
- No root/frontend `.env.example` was found.
- Environment variables referenced by code include `REACT_APP_BASE_URL`, `PORT`, `MONGODB_URL`, `JWT_SECRET`, `CLOUD_NAME`, `API_KEY`, `API_SECRET`, `FOLDER_NAME`, `RAZORPAY_KEY`, `RAZORPAY_SECRET`, `RESEND_API_KEY`, and legacy/commented SMTP variables.

## Test infrastructure

- Root/frontend has CRA test script and Testing Library dependencies.
- Backend has no test script.
- No checked-in `*.test.*`, `*.spec.*`, or `__tests__` files were found by static filename search during Phase 0/1 inspection.

## Generated files that should not be edited manually

- `build/`
- `node_modules/`
- `server/node_modules/` if present locally
- package lockfiles should not be hand-edited
- static binary/image/video assets should not be changed manually unless a design/content task explicitly requires it

## Git-tracked configuration

- `.editorconfig`
- `.gitignore`
- `.nvmrc`
- `.prettierignore`
- `prettier.config.js`
- `tailwind.config.js`
- `package.json`
- `package-lock.json`
- `server/package.json`
- `server/.env.example`
- `server/.gitignore`
- `public/_redirects`
