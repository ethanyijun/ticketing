# Microservices Monorepo Best Practices for Multi-Team Development

## The Real-World Challenge

In a microservices monorepo with multiple teams:
- **Team A** owns `payments`
- **Team B** owns `orders`
- **Team C** owns `tickets`
- **Platform Team** owns `common`

**Question**: How do teams work independently without stepping on each other?

## Local Development Strategies

### ❌ Anti-Pattern: Everyone Runs Everything

```bash
# BAD: Every developer runs all services
skaffold dev  # Starts all 7 services locally
```

**Problems**:
- ❌ Heavy resource usage (CPU, memory, ports)
- ❌ Slow startup time
- ❌ Hard to debug (too many moving parts)
- ❌ Conflicts when multiple devs run same services
- ❌ Doesn't reflect real-world deployment

### ✅ Best Practice: Run Only What You Need

Teams should run:
1. **Their own service** (the one they're developing)
2. **Local dependencies** (databases, message queues)
3. **Connect to shared dev environment** for other services**

## Recommended Local Development Patterns

### Pattern 1: Service + Local Dependencies Only (Recommended)

**For a developer working on `payments`:**

```bash
# Terminal 1: Start local dependencies (Docker Compose)
docker-compose -f docker-compose.local.yml up

# Terminal 2: Run their service locally
cd payments
pnpm build:common  # Build common dependency (always needed)
pnpm start         # Run payments service locally (ts-node-dev)

# Other services (orders, tickets, auth) run in shared dev environment
# Payments service connects to them via environment variables
```

**What this means:**
- ✅ **Your service**: Runs locally (`payments`)
- ✅ **Local dependencies**: MongoDB, Redis, Kafka (via docker-compose)
- ✅ **Other services**: Connect to **shared dev environment** (not mocked)
- ✅ **Common package**: Always built (it's a dependency)

**Benefits**:
- ✅ Fast startup (only one service)
- ✅ Low resource usage
- ✅ Easy debugging (your service is local)
- ✅ Tests against **real services** (shared dev environment)
- ✅ Common package built automatically by Turborepo

**Setup**:
```yaml
# docker-compose.local.yml
version: '3.8'
services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  kafka:
    image: confluentinc/cp-kafka:latest
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
```

### Pattern 2: Service + Direct Dependencies Only

**For a developer working on `orders` (depends on `tickets`):**

```bash
# Build common first (always needed)
pnpm build:common

# Option A: Run tickets service locally (if you need to modify it)
cd tickets && pnpm start &

# Run orders service (their service)
cd orders && pnpm start
```

**Use Turborepo to manage this:**
```bash
# Run orders + its dependencies (tickets, common)
# Turborepo automatically builds common first
pnpm dev --filter orders --filter tickets --filter @ethtickets/common
```

**When to use this:**
- You're working on `orders` AND need to modify `tickets` at the same time
- You're testing integration between two specific services
- Other services still connect to shared dev environment

### Pattern 3: Full Local Stack (Only When Needed)

**When to use**:
- Integration testing
- Debugging complex interactions
- Onboarding new developers
- Testing end-to-end flows

```bash
# Use Skaffold for full stack
skaffold dev
```

**When NOT to use**:
- Daily development
- Working on isolated features
- Quick iterations

## Integration Testing Strategies

### 1. Contract Testing (Recommended)

**Use tools like Pact or Spring Cloud Contract:**

```typescript
// payments/src/__contracts__/order-created.test.ts
import { pactWith } from 'jest-pact';

pactWith({ consumer: 'payments', provider: 'orders' }, (provider) => {
  describe('Order Created Event', () => {
    it('should handle order created event', async () => {
      await provider.addInteraction({
        state: 'an order exists',
        uponReceiving: 'an order created event',
        withRequest: {
          method: 'POST',
          path: '/events/order-created',
          body: {
            id: '123',
            status: 'created',
            userId: 'user-1'
          }
        },
        willRespondWith: {
          status: 200
        }
      });
    });
  });
});
```

**Benefits**:
- ✅ Teams can work independently
- ✅ Catch breaking changes early
- ✅ No need for all services running
- ✅ Fast execution

### 2. Shared Integration Test Environment

**Setup a dedicated integration test environment:**

```yaml
# .github/workflows/integration-tests.yaml
name: Integration Tests

on:
  pull_request:
    paths:
      - '**/*'

jobs:
  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2

      # Deploy all services to test environment
      - run: skaffold run --profile=integration-test

      # Run integration tests
      - run: pnpm test:integration

      # Cleanup
      - run: skaffold delete
```

**Benefits**:
- ✅ Tests against real services
- ✅ Catches integration issues
- ✅ Runs in CI/CD automatically

### 3. Service Virtualization

**Use tools like WireMock or Mountebank:**

```typescript
// payments/src/test/setup.ts
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  // Mock orders service
  rest.post('http://orders-service/api/orders', (req, res, ctx) => {
    return res(ctx.json({ id: '123', status: 'created' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Benefits**:
- ✅ Fast tests
- ✅ Predictable behavior
- ✅ No external dependencies

### 4. Staged Integration Testing

**Test in stages:**

```bash
# Stage 1: Unit tests (fast, local)
pnpm test --filter payments

# Stage 2: Contract tests (medium speed)
pnpm test:contracts --filter payments

# Stage 3: Integration tests (slow, shared env)
pnpm test:integration --filter payments

# Stage 4: E2E tests (slowest, full stack)
pnpm test:e2e
```

## Monorepo Structure for Multi-Team

### Directory Structure

```
ticketing/
├── services/
│   ├── payments/          # Team A owns
│   │   ├── src/
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   ├── contracts/  # Contract tests
│   │   │   └── integration/
│   │   └── OWNERS         # Team ownership file
│   │
│   ├── orders/            # Team B owns
│   ├── tickets/           # Team C owns
│   └── ...
│
├── packages/
│   └── common/            # Platform team owns
│
├── docker-compose.local.yml  # Local dependencies
└── skaffold.yaml          # Full stack deployment
```

### Ownership Files

```yaml
# payments/OWNERS
teams:
  - payments-team
approvers:
  - @payments-team-lead
reviewers:
  - @payments-team
```

**Use CODEOWNERS for GitHub:**
```
# .github/CODEOWNERS
/services/payments/ @payments-team
/services/orders/ @orders-team
/packages/common/ @platform-team
```

## CI/CD Strategy

### Branch Protection by Service

```yaml
# .github/workflows/ci-payments.yaml
name: CI - Payments

on:
  pull_request:
    paths:
      - 'payments/**'
      - 'common/**'  # Also trigger on common changes

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2

      # Build dependencies
      - run: pnpm build --filter @ethtickets/common
      - run: pnpm build --filter payments

      # Run tests
      - run: pnpm test:ci --filter payments
      - run: pnpm test:contracts --filter payments

  integration:
    needs: test
    runs-on: ubuntu-latest
    steps:
      # Deploy to test environment
      - run: skaffold run --profile=test

      # Run integration tests
      - run: pnpm test:integration --filter payments
```

### Affected Package Detection

```yaml
# Only test what changed
- run: pnpm test:ci --filter=...[origin/main]
- run: pnpm build --filter=...[origin/main]
```

## Development Workflow Examples

### Scenario 1: Payments Team Working on New Feature

```bash
# 1. Start local dependencies
docker-compose -f docker-compose.local.yml up -d

# 2. Build common (dependency)
pnpm build:common

# 3. Run payments service locally
cd payments
pnpm start

# 4. Connect to shared dev environment for:
#    - orders service (running in dev cluster)
#    - tickets service (running in dev cluster)
#    - auth service (running in dev cluster)

# 5. Run tests
pnpm test --filter payments
```

### Scenario 2: Testing Integration with Orders

```bash
# Option A: Use shared dev environment
# Payments service runs locally, connects to orders in dev

# Option B: Run both locally
pnpm dev --filter payments --filter orders --filter @ethtickets/common

# Option C: Use contract tests (no services needed)
pnpm test:contracts --filter payments
```

### Scenario 3: Full Stack Testing

```bash
# Only when needed (integration testing, E2E)
skaffold dev
```

## Best Practices Summary

### ✅ DO

1. **Run only what you need locally**
   - Your service + local dependencies (DB, queues)
   - Connect to shared dev for other services

2. **Use contract testing**
   - Teams can work independently
   - Catch breaking changes early

3. **Clear ownership boundaries**
   - CODEOWNERS file
   - Team-specific CI/CD pipelines

4. **Staged testing approach**
   - Unit tests (fast, always run)
   - Contract tests (medium, on PR)
   - Integration tests (slow, on merge)

5. **Use Turborepo for dependency management**
   - Automatically builds dependencies
   - Only builds what changed

### ❌ DON'T

1. **Don't require all services for daily dev**
   - Too heavy, too slow

2. **Don't skip integration testing**
   - Contract tests are not enough
   - Need real integration tests in CI

3. **Don't break service boundaries**
   - Services should be independently deployable
   - Don't create circular dependencies

4. **Don't ignore common package changes**
   - All teams affected by `common` changes
   - Need proper versioning and testing

## Recommended Tooling

### For Local Development
- **Docker Compose**: Local dependencies (DB, queues)
- **Turborepo**: Dependency management and builds
- **ts-node-dev**: Fast local service execution
- **Service mocks**: For unavailable services

### For Testing
- **Jest/Vitest**: Unit tests
- **Pact/Spring Cloud Contract**: Contract testing
- **Testcontainers**: Integration test dependencies
- **Skaffold**: Full stack testing

### For CI/CD
- **Turborepo**: Affected package detection
- **GitHub Actions**: CI/CD pipelines
- **Kubernetes**: Test environments
- **ArgoCD/Flux**: GitOps deployment

## Example: Complete Workflow

### Daily Development (Payments Team)

```bash
# Morning: Start local environment
docker-compose -f docker-compose.local.yml up -d
pnpm build:common
cd payments && pnpm start

# Develop feature...
# Run tests
pnpm test --filter payments

# Before committing: Run contract tests
pnpm test:contracts --filter payments
```

### Before PR

```bash
# CI automatically runs:
# 1. Unit tests
# 2. Contract tests
# 3. Integration tests (in test environment)
# 4. Build verification
```

### After Merge

```bash
# CI automatically:
# 1. Deploys to staging
# 2. Runs E2E tests
# 3. Deploys to production (if staging passes)
```

## Conclusion

**Key Principles**:
1. **Independence**: Teams should work independently
2. **Testing**: Multiple layers (unit → contract → integration → E2E)
3. **Efficiency**: Run only what you need locally
4. **Automation**: CI/CD handles integration testing
5. **Ownership**: Clear boundaries and responsibilities

**For your monorepo**:
- Use `docker-compose` for local dependencies
- Use Turborepo to manage service dependencies
- Use Skaffold only for full-stack testing
- Implement contract testing for team independence
- Set up staged integration testing in CI/CD
