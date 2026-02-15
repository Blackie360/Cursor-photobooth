# Node.js Basic Example

Plain Node.js usage of `@payhero/sdk`. No framework dependency.

## Install

```bash
pnpm add @payhero/sdk
```

## Run

After building the monorepo (`pnpm build` from root):

```bash
PAYHERO_AUTH_TOKEN=your-token node --import tsx index.ts
```

Or compile and run: `tsc` then `node index.js`

Or set `PAYHERO_BASE_URL` if using a custom API base.
