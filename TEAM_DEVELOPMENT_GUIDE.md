# Team Development Quick Guide

## TL;DR: How Teams Work Locally

### ✅ Recommended: Run Only Your Service

**For Payments Team:**
```bash
# 1. Start local dependencies (MongoDB, Redis, Kafka)
pnpm local:up

# 2. Build common package
pnpm build:common

# 3. Run your service
cd payments && pnpm start

# Other services connect to shared dev environment
```

**Or use the helper script:**
```bash
./scripts/dev-service.sh payments
```

### ❌ Not Recommended: Run All Services

```bash
# Only use this for:
# - Full integration testing
# - E2E testing
# - Debugging complex interactions

skaffold dev  # Heavy, slow, resource-intensive
```

## Integration Testing Strategy

### 1. **Unit Tests** (Always Run Locally)
```bash
pnpm test --filter payments
```

### 2. **Contract Tests** (Before PR)
```bash
pnpm test:contracts --filter payments
```

### 3. **Integration Tests** (In CI/CD)
```bash
# Automatically runs in CI when you create PR
# Tests against shared test environment
```

### 4. **E2E Tests** (After Merge)
```bash
# Runs in staging environment
# Full stack validation
```

## Common Workflows

### Daily Development
```bash
# Morning
pnpm local:up          # Start dependencies
pnpm build:common      # Build common
cd payments && pnpm start

# During development
pnpm test --filter payments  # Run tests

# Before committing
pnpm test:contracts --filter payments
```

### Testing Integration
```bash
# Option 1: Use shared dev environment (recommended)
# Your service runs locally, connects to others in dev

# Option 2: Run specific services locally
pnpm dev --filter payments --filter orders

# Option 3: Full stack (only when needed)
skaffold dev
```

### When Common Package Changes
```bash
# 1. Build common
pnpm build:common

# 2. Rebuild your service
pnpm build --filter payments

# 3. Run tests
pnpm test --filter payments
```

## Key Principles

1. **Independence**: Teams work on their service independently
2. **Local Dependencies Only**: Run DB, queues locally; other services in dev
3. **Staged Testing**: Unit → Contract → Integration → E2E
4. **CI/CD Automation**: Integration tests run automatically
5. **Clear Ownership**: Each team owns their service

## Troubleshooting

### "Common package not found"
```bash
pnpm build:common
```

### "Can't connect to other services"
- Check if shared dev environment is running
- Verify service URLs in environment variables
- Use service mocks for unavailable services

### "Integration tests failing"
- Check shared test environment status
- Verify service contracts haven't changed
- Run contract tests first

## Quick Commands Reference

```bash
# Local development
pnpm local:up          # Start dependencies
pnpm local:down             # Stop dependencies
pnpm build:common           # Build common package
./scripts/dev-service.sh payments  # Start service

# Testing
pnpm test --filter payments              # Unit tests
pnpm test:contracts --filter payments    # Contract tests
pnpm test:integration --filter payments  # Integration tests

# Full stack (only when needed)
pnpm skaffold:dev  # Start all services
```

## See Also

- [MICROSERVICES_MONOREPO_BEST_PRACTICES.md](./MICROSERVICES_MONOREPO_BEST_PRACTICES.md) - Detailed best practices
- [LOCAL_DEV_WITH_SKAFFOLD.md](./LOCAL_DEV_WITH_SKAFFOLD.md) - Skaffold integration
- [TURBOREPO_DOCKER_K8S.md](./TURBOREPO_DOCKER_K8S.md) - Turborepo benefits
