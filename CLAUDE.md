# GN Foundation

Product: Charity website — RMTH/RSTH talent hunt exams, student certificate download portal
Domain: (Vercel-hosted — see DEPLOYMENT.md for custom domain setup)
Virora AI agents: D:\Virora-AI\agents\ | Shared context: D:\Virora-AI\

## Deployment
- **Current (dev):** Vercel — git push main → auto-build and deploy
- **Planned:** Migrate to Hostinger Business Shared Hosting (Node.js Apps plan) — same as Abhyaas, GTimes, Greenvaley, Greenwood
- **DB:** MongoDB Atlas (cloud) — connection via MONGODB_URI env var
- **Storage:** Cloudinary — student images + PDF certificate templates
- **Env vars:** MONGODB_URI, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD, NEXT_PUBLIC_APP_URL
- **Migration note:** Next.js on Hostinger shared requires `next start` (not serverless) — ensure build output is `standalone` in next.config and NODE_ENV=production is set

## Stack
- Runtime: Next.js 14 (App Router), TypeScript
- Database: MongoDB + Mongoose
- Storage: Cloudinary (images + PDF templates)
- Certificate generation: pdf-lib (no Puppeteer in production — Vercel serverless)
- Auth: JWT-based admin login
- UI: Tailwind CSS + Radix UI (shadcn/ui)
- Dev port: 7000 (`next dev -p 7000`)

## Structure
- `app/` — Next.js App Router pages and API routes
- `components/` — UI components
- `lib/` — DB connection, Cloudinary helpers, pdf-lib utils
- `models/` — Mongoose models: Student, Awardee, CertificateConfig, CertificateTemplate
- `public/` — static assets

## Key Routes
- `/` — Homepage
- `/participation` — Student admission number entry → certificate download
- `/awards` — Past awardees showcase
- `/admin` — Admin panel
- `/login` — Admin auth
- `/api/*` — REST API routes (Next.js route handlers)

## Design Tokens
- Primary: #1E3A8A (deep blue)
- Background: #E3F2FD (light blue)
- Accent: #FFC107 (golden yellow)
- Font: PT Sans

## Architecture Notes
- Certificate generation is on-demand: pdf-lib fills student data into uploaded PDF templates
- Templates stored on Cloudinary, fetched at generation time
- No server-side sessions — JWT stored in cookies
- `apphosting.yaml` present but deployment is Vercel, not Firebase App Hosting

## Context rule
Repository is the source of truth. If this file conflicts with current code/config, flag CONTEXT DRIFT.
