# Pattern 1: Service + Local Dependencies - Detailed Explanation

## What Pattern 1 Actually Means

### ✅ What You Run Locally

1. **Your service** (the one you're developing)
   - Example: `payments` service
   - Runs via `ts-node-dev` (TypeScript directly, no Docker)

2. **Local infrastructure dependencies** (via Docker Compose)
   - MongoDB (database)
   - Redis (cache/queues)
   - Kafka (message broker)
   - Zookeeper (for Kafka)

3. **Common package** (built, not running)
   - Always built (it's a compile-time dependency)
   - Turborepo handles this automatically
   - Only rebuilds if `common` source changes

### ❌ What You DON'T Run Locally

- **Other services** (orders, tickets, auth, etc.)
- These run in a **shared dev environment** (not mocked!)

## The Key Distinction: Shared Dev vs Mocking

### Option A: Connect to Shared Dev Environment (Recommended)

```bash
# Your service connects to real services in shared dev
# Environment variables point to shared dev URLs:

# .env.local
ORDERS_SERVICE_URL=http://orders-service.dev.company.com
TICKETS_SERVICE_URL=http://tickets-service.dev.company.com
AUTH_SERVICE_URL=http://auth-service.dev.company.com
```

**Benefits:**
- ✅ Tests against **real services**
- ✅ Catches integration issues early
- ✅ No need to maintain mocks
- ✅ Always up-to-date with latest code

**When to use:**
- Daily development
- Most common scenario

### Option B: Mock Other Services (Alternative)

```typescript
// payments/src/test/mocks/orders-service.ts
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const mockOrdersService = setupServer(
  rest.post('http://orders-service/api/orders', (req, res, ctx) => {
    return res(ctx.json({ id: '123', status: 'created' }));
  })
);
```

**When to use:**
- Shared dev environment is down
- Testing error scenarios
- Offline development
- Specific edge cases

## Common Package: Build Behavior

### Always Built (But Smart Caching)

```bash
# First time
pnpm build:common  # Builds common package

# If common hasn't changed
pnpm build:common  # Turborepo uses cache (instant!)

# If common changed
pnpm build:common  # Turborepo rebuilds only what changed
```

**Turborepo handles this:**
- ✅ Detects if `common` source files changed
- ✅ Only rebuilds if necessary
- ✅ Caches build outputs
- ✅ Fast incremental builds

### Automatic Dependency Building

When you run:
```bash
pnpm dev --filter payments
```

Turborepo automatically:
1. Checks if `common` needs building
2. Builds `common` if it changed or doesn't exist
3. Then starts `payments` service

## Complete Example: Payments Team

### Setup

```bash
# 1. Start local dependencies
pnpm local:up
# Starts: MongoDB, Redis, Kafka, Zookeeper

# 2. Build common (Turborepo handles caching)
pnpm build:common
# Output: common/build/ directory created

# 3. Start payments service
cd payments
pnpm start
# Runs: ts-node-dev src/index.ts
```

### Environment Configuration

```bash
# payments/.env.local

# Local dependencies (Docker Compose)
MONGODB_URL=mongodb://localhost:27017/payments
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092

# Other services (Shared Dev Environment)
ORDERS_SERVICE_URL=https://orders.dev.company.com
TICKETS_SERVICE_URL=https://tickets.dev.company.com
AUTH_SERVICE_URL=https://auth.dev.company.com

# Your service (Local)
PORT=3000
```

### What Happens When You Make Changes

#### Scenario 1: You change `payments/src/`
```bash
# ts-node-dev automatically:
# - Detects file change
# - Recompiles TypeScript
# - Restarts service
# - No rebuild needed
```

#### Scenario 2: You change `common/src/`
```bash
# Option A: Manual rebuild
pnpm build:common  # Rebuilds common
# payments service picks up changes on next request

# Option B: Watch mode (recommended)
pnpm watch:common  # Watches and rebuilds automatically
```

#### Scenario 3: Other services change (in shared dev)
```bash
# Nothing to do!
# Your service automatically uses latest version
# from shared dev environment
```

## Comparison: Pattern 1 vs Other Patterns

### Pattern 1: Service + Local Dependencies
```
Local:
  - payments service (your service)
  - MongoDB, Redis, Kafka (infrastructure)

Shared Dev:
  - orders service
  - tickets service
  - auth service
  - etc.

Common:
  - Built locally (cached by Turborepo)
```

### Pattern 2: Service + Direct Dependencies
```
Local:
  - payments service (your service)
  - orders service (dependency you're modifying)
  - MongoDB, Redis, Kafka

Shared Dev:
  - tickets service
  - auth service
  - etc.

Common:
  - Built locally
```

### Pattern 3: Full Stack (Skaffold)
```
Local (via Skaffold):
  - ALL services
  - ALL infrastructure
  - Full Kubernetes cluster

Common:
  - Built in Docker containers
```

## Best Practices for Pattern 1

### ✅ DO

1. **Always build common first**
   ```bash
   pnpm build:common
   ```

2. **Use watch mode when developing common**
   ```bash
   pnpm watch:common  # In separate terminal
   ```

3. **Connect to shared dev for other services**
   - Use environment variables
   - Document service URLs
   - Keep URLs updated

4. **Use Turborepo for dependency management**
   ```bash
   # Automatically handles common build
   pnpm dev --filter payments
   ```

### ❌ DON'T

1. **Don't mock other services** (unless necessary)
   - Use shared dev environment
   - Mocks can get stale

2. **Don't skip building common**
   - Services depend on `common/build/`
   - Will fail without it

3. **Don't run all services locally**
   - Too heavy
   - Unnecessary for daily dev

## Troubleshooting

### "Cannot find module '@ethtickets/common'"
```bash
# Solution: Build common
pnpm build:common
```

### "Other services not responding"
```bash
# Check shared dev environment
curl https://orders.dev.company.com/health

# Or use mocks temporarily
```

### "Common changes not reflected"
```bash
# Rebuild common
pnpm build:common

# Or use watch mode
pnpm watch:common
```

## Summary

**Pattern 1 means:**
- ✅ Run **one service** locally
- ✅ Run **infrastructure** locally (DB, queues)
- ✅ Connect to **real services** in shared dev (not mocked)
- ✅ Build **common package** (Turborepo handles caching)
- ✅ Common only rebuilds if source changes

**Key insight:** You're not mocking other services - you're connecting to a shared development environment where they're already running. This gives you real integration testing while keeping your local setup lightweight.
