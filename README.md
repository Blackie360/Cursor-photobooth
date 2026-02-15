# PayHero Monorepo

This repository hosts a monorepo for PayHero Kenya integrations.

## Packages

- `@payhero/sdk`: framework-agnostic Node.js client
- `@payhero/next`: Next.js App Router server helpers

## Quickstart

```bash
pnpm install
pnpm test
```

## Environment

Set these variables in your app environment:

- `PAYHERO_AUTH_TOKEN`
- `PAYHERO_BASE_URL` (optional, defaults to `https://backend.payhero.co.ke/api/v2`)

## Notes

This is the initial scaffold and baseline implementation. More endpoint coverage and production hardening can be added incrementally.
