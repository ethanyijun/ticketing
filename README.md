## Monorepo Setup

This project uses **pnpm workspaces** and **Turborepo** for monorepo management.

### Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run all services in development
pnpm dev

# Run tests
pnpm test
```

See [MIGRATION.md](./MIGRATION.md) for detailed migration guide and usage instructions.

## TODO List

1. **Using Nest.js(rpc?) to rewrite the APIs** (In progress)
2. **Add authorization** (In progress)
3. **Support ticket quantity** (In progress)
4. **Domain** (Done)
5. **UI** (Done)
6. **Email service** (In progress)
7. **Shopping cart** (Todo)
8. **Fix tests** (In progress)
9. **Verify user email during sign up** (Todo)
10. **Use monorepo tools to manage dependencies** (Done ✅)