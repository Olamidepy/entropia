# Deployment Guide

This guide details the procedure for deploying Entropia to staging and production environments.

## Vercel Deployment

1. **Link Repository**: Connect your GitHub repository to Vercel.
2. **Configure Environment Variables**: Supply `DATABASE_URL` and `OPENAI_API_KEY`.
3. **Build Command**: Set to `npm run build` (which automatically executes `prisma generate && next build`).
4. **Deploy**: Push to `main` branch to trigger automated CI/CD deployment.

## Docker Deployment

To launch locally using Docker:
```bash
docker compose up -d
```
This boots a localized PostgreSQL database ready for schema migration (`npm run db:push`).
