# Quick Answers to Your Questions

## Q1: Do different teams own different services and work in isolation?

**Yes!** In real-world microservices:
- **Payments Team** owns `payments` service
- **Orders Team** owns `orders` service
- **Tickets Team** owns `tickets` service
- **Platform Team** owns `common` package
- **Frontend Team** owns `client` (Next.js)

Teams work **independently** but coordinate through:
- **Contracts** (API agreements)
- **Shared infrastructure** (common package, K8s)
- **Integration environments** (dev, staging)

## Q2: How to work on one service but test the UI?

**Use contract testing with mocks:**

```bash
# 1. Start contract mocks (Specmatic, WireMock, etc.)
pnpm mocks:up

# 2. Start your service
cd payments && pnpm start

# 3. Start frontend
cd client && pnpm dev

# Frontend calls:
#   - payments (real, your code)
#   - orders (mock, from contract)
#   - tickets (mock, from contract)
#   - auth (mock, from contract)
```

**Result:** ✅ You can test full UI flow with only your service running!

## Q3: Can Turborepo detect dependencies automatically?

**Yes!** Turborepo automatically:

1. **Reads package.json dependencies:**
   ```json
   {
     "dependencies": {
       "@ethtickets/common": "workspace:*"  // ← Detected!
     }
   }
   ```

2. **Builds dependency graph:**
   ```
   common (must build first)
     └── payments (depends on common)
     └── orders (depends on common)
   ```

3. **Builds in correct order:**
   ```bash
   pnpm build --filter payments
   # Turborepo automatically builds common first!
   ```

## Q4: What if I touch a file used by multiple services?

**Scenario:** You change `common/src/events/order-created-event.ts`
- Used by: `orders`, `payments`, `tickets`
- You're working on: `payments`

**What happens:**

```bash
# You run:
pnpm build --filter payments

# Turborepo:
1. Detects common changed ✅
2. Builds common first (payments needs it) ✅
3. Builds payments ✅
4. Skips orders and tickets (not in filter) ✅
```

**Result:** ✅ Works fine! Only `payments` gets rebuilt with updated `common`.

**If you run:**
```bash
pnpm build  # All packages

# Turborepo:
1. Builds common first
2. Then builds orders, payments, tickets in parallel
```

**Result:** ✅ All services get updated `common`.

## Q5: Best Practices Summary

### ✅ DO

1. **Use contract testing** (Specmatic, Pact)
   - Define contracts first
   - Generate mocks from contracts
   - Test against contracts

2. **Mock other services during development**
   - Fast iteration
   - Work independently
   - Test UI with mocks

3. **Let Turborepo handle dependencies**
   - Automatic detection
   - Smart caching
   - Parallel builds

4. **Staged testing:**
   - Unit tests (fast)
   - Contract tests (medium)
   - Integration tests with mocks (medium)
   - Integration tests with real services (slow, CI/CD)
   - E2E tests (slowest, staging)

### ❌ DON'T

1. **Don't run all services locally** (too heavy)
2. **Don't skip contract testing** (catch breaking changes)
3. **Don't ignore dependency changes** (Turborepo handles it, but test)
4. **Don't break contracts** (version breaking changes)

## Complete Workflow Example

### Working on Payments Service + Testing UI

```bash
# Terminal 1: Infrastructure
pnpm local:up

# Terminal 2: Contract mocks
pnpm mocks:up

# Terminal 3: Build common
pnpm build:common

# Terminal 4: Payments service (your code)
cd payments && pnpm start

# Terminal 5: Frontend
cd client && pnpm dev
```

**Result:**
- ✅ Payments service: Real (your code)
- ✅ Other services: Mocked (from contracts)
- ✅ Frontend: Can test full UI flow
- ✅ Fast, isolated development

## Tools Setup

I've created:
- ✅ `docker-compose.contracts.yml` - Contract mock servers
- ✅ `scripts/dev-with-mocks.sh` - Helper script
- ✅ `contracts/README.md` - Contract documentation
- ✅ `REAL_WORLD_MICROSERVICES.md` - Complete guide

## Quick Commands

```bash
# Start development with mocks
./scripts/dev-with-mocks.sh payments

# Or manually:
pnpm local:up          # Infrastructure
pnpm mocks:up          # Contract mocks
pnpm build:common      # Build common
cd payments && pnpm start  # Your service
cd client && pnpm dev      # Frontend
```

## See Also

- `REAL_WORLD_MICROSERVICES.md` - Complete real-world guide
- `MICROSERVICES_MONOREPO_BEST_PRACTICES.md` - Best practices
- `PATTERN_1_EXPLAINED.md` - Pattern 1 detailed explanation
