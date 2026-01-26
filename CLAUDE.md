# Honey Explorer (Raw Honey Guide)

## Deployment

**IMPORTANT: This project auto-deploys via GitHub Actions on push to main.**

Do NOT run `fly deploy` manually. Just commit and push changes - the GitHub Action at `.github/workflows/deploy.yml` handles deployment automatically.

- Hosting: Fly.io
- Domain: rawhoneyguide.com
- Deployment trigger: Push to `main` branch

## Tech Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Java Spring Boot
- Database: (check backend config)
- Hosting: Fly.io

## Analytics

- Google Analytics: G-B5WK963N5F
