# Admin Deployment

## Cloudflare Pages

- Project: `legaldhara-admin`
- Repository: `legaldhara/admin`
- Production branch: `main`
- Framework preset: React (Vite)
- Build command: `npm run build`
- Output directory: `dist`
- Production domain: `admin.legaldhara.com`
- Production API and Socket.IO variable: `VITE_BACKEND_API_URL=https://api.legaldhara.com`
- Configure all public Firebase variables from `.env.example` in Cloudflare Pages.
- Keep preview deployments enabled for pull requests and non-production branches.

The admin is not deployed below `/admin`; the old path is retired after cutover. `public/_redirects` provides client-side routing fallback for the dedicated admin domain.

## Verification

Run `npm ci`, `npm test`, `npm run lint:ci`, `npx tsc -b`, and `npm run build`. Confirm `dist/_redirects` and `dist/_headers` exist before connecting the custom domain.

`npm run lint` currently reports legacy `no-explicit-any` debt outside the deployment scope. CI enforces unchanged ESLint rules on the payment and deployment surfaces through `lint:ci`; the full baseline remains a separate cleanup task.
