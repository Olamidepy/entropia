# Environment Variables Reference

This document provides a comprehensive overview of all configuration environment variables utilized by Entropia.

## Required Variables

| Variable | Description | Example / Default |
| -------- | ----------- | ----------------- |
| `DATABASE_URL` | PostgreSQL connection URI for Prisma ORM | `postgresql://postgres:postgres@localhost:5432/entropia` |
| `OPENAI_API_KEY` | OpenAI API key for autonomous intelligence synthesis | `sk-...` |

## Optional Variables

| Variable | Description | Example / Default |
| -------- | ----------- | ----------------- |
| `NODE_ENV` | Runtime environment mode | `development` / `production` |
| `FILECOIN_GATEWAY_URL` | IPFS/Filecoin gateway endpoint | `https://gateway.lighthouse.storage` |
| `FILECOIN_API_KEY` | Lighthouse / Web3.Storage authorization token | `api_key_...` |
| `MONITOR_POLL_INTERVAL_MS` | Telemetry ingestion poll cycle frequency | `10000` |
| `LOG_LEVEL` | Application logging granularity | `info` / `debug` / `warn` |
