# Real-World Microservices Development: Complete Guide

## How Microservices Work in the Real World

### Team Structure

**Yes, different teams own different services and work in isolation:**

```
Company Structure:
├── Payments Team (5-8 developers)
│   └── Owns: payments service
│   └── Works independently
│
├── Orders Team (5-8 developers)
│   └── Owns: orders service
│   └── Works independently
│
├── Tickets Team (5-8 developers)
│   └── Owns: tickets service
│   └── Works independently
│
├── Platform Team (3-5 developers)
│   └── Owns: common package, infrastructure
│   └── Supports all teams
│
└── Frontend Team (5-10 developers)
    └── Owns: client (Next.js app)
    └── Works with all backend services
```

**Key Principle:** Teams work independently but coordinate through:
- **Contracts** (API contracts, event schemas)
- **Shared infrastructure** (common package, K8s, databases)
- **Integration environments** (dev, staging, prod)

## Working in Isolation in a Monorepo

### The Challenge

You're working on `payments` service, but:
- Frontend needs to call `orders`, `tickets`, `auth` services
- You need to test the full UI flow
- Other services might be broken or unavailable

### Solution: Contract Testing + Service Mocking

**Using Specmatic (or Pact, WireMock, etc.)**

## Contract Testing with Specmatic

### What is Contract Testing?

**Contract = Agreement between services:**
- Request format (endpoints, parameters, body)
- Response format (status codes, data structure)
- Events (Kafka message formats)

**Example Contract:**
```yaml
# contracts/orders-service.yml
openapi: 3.0.0
info:
  title: Orders Service API
  version: 1.0.0
paths:
  /api/orders:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [ticketId, userId]
              properties:
                ticketId:
                  type: string
                userId:
                  type: string
      responses:
        '201':
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                  status:
                    type: string
                  ticketId:
                    type: string
```

### Using Specmatic to Mock Services

**Specmatic reads contracts and creates mock servers:**

```bash
# Start Specmatic mock server
specmatic stub contracts/orders-service.yml --port 3001
specmatic stub contracts/tickets-service.yml --port 3002
specmatic stub contracts/auth-service.yml --port 3003
```

**Your payments service connects to mocks:**
```typescript
// payments/.env.local
ORDERS_SERVICE_URL=http://localhost:3001
TICKETS_SERVICE_URL=http://localhost:3002
AUTH_SERVICE_URL=http://localhost:3003
```

**Frontend also connects to mocks:**
```typescript
// client/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
# Backend services mocked via Specmatic
```

## Complete Development Workflow

### Scenario: Working on Payments Service + Testing UI

```bash
# Terminal 1: Start local infrastructure
pnpm local:up
# Starts: MongoDB, Redis, Kafka

# Terminal 2: Start Specmatic mock servers
docker-compose -f docker-compose.contracts.yml up
# Starts: Mock servers for orders, tickets, auth

# Terminal 3: Build common
pnpm build:common

# Terminal 4: Start payments service (your service)
cd payments
pnpm start
# Runs on localhost:3000

# Terminal 5: Start frontend
cd client
pnpm dev
# Runs on localhost:3001
# Frontend calls:
#   - payments (real, localhost:3000)
#   - orders (mock, localhost:3001)
#   - tickets (mock, localhost:3002)
#   - auth (mock, localhost:3003)
```

**Result:**
- ✅ You can test full UI flow
- ✅ Payments service is real (your code)
- ✅ Other services are mocked (from contracts)
- ✅ Fast, isolated development

## Turborepo Dependency Detection

### How Turborepo Detects Dependencies

Turborepo uses **file system analysis** and **package.json dependencies**:

```json
// payments/package.json
{
  "dependencies": {
    "@ethtickets/common": "workspace:*"  // ← Dependency detected
  }
}
```

**Turborepo builds dependency graph:**
```
common (must build first)
  └── payments (depends on common)
  └── orders (depends on common)
  └── tickets (depends on common)
```

### What Happens When You Touch a File?

#### Scenario: You touch `common/src/events/order-created-event.ts`

**This file is used by:**
- `orders` service (publishes this event)
- `payments` service (listens to this event)
- `tickets` service (might use it)

**But you're only working on `payments` service:**

```bash
# You run:
pnpm build --filter payments

# Turborepo automatically:
1. Detects common changed (via file watching)
2. Builds common first (because payments depends on it)
3. Then builds payments
4. Skips orders and tickets (not in filter)
```

**Result:**
- ✅ `common` is rebuilt (needed by payments)
- ✅ `payments` is rebuilt (your service)
- ❌ `orders` and `tickets` are NOT rebuilt (not needed)

### Affected Package Detection

```bash
# Only build what changed
pnpm build --filter=...[origin/main]

# Turborepo:
1. Compares current branch to origin/main
2. Finds changed files
3. Determines which packages are affected
4. Only builds those packages
```

**Example:**
```bash
# You changed:
# - common/src/events/order-created-event.ts
# - payments/src/listeners/order-created-listener.ts

# Turborepo detects:
# - common package changed → needs rebuild
# - payments package changed → needs rebuild
# - orders package NOT changed → skip
# - tickets package NOT changed → skip
```

## Best Practices for Real-World Development

### 1. Contract-First Development

**Define contracts before implementation:**

```yaml
# contracts/payments-service.yml
# Define API contract
# Teams agree on contract
# Then implement services
```

**Benefits:**
- ✅ Teams work in parallel
- ✅ Contracts serve as documentation
- ✅ Mocks available immediately
- ✅ Catch breaking changes early

### 2. Staged Testing Strategy

```bash
# Stage 1: Unit Tests (fast, always run)
pnpm test --filter payments
# Tests: payments service in isolation

# Stage 2: Contract Tests (medium speed)
pnpm test:contracts --filter payments
# Tests: payments service against contracts

# Stage 3: Integration Tests with Mocks (medium speed)
pnpm test:integration --filter payments
# Tests: payments + mocked dependencies

# Stage 4: Integration Tests with Real Services (slow)
# Runs in CI/CD against shared test environment
# Tests: payments + real dependencies

# Stage 5: E2E Tests (slowest)
# Full stack testing in staging environment
```

### 3. Development Environment Setup

**Create docker-compose for contract mocks:**

```yaml
# docker-compose.contracts.yml
version: '3.8'

services:
  orders-mock:
    image: specmatic/specmatic:latest
    ports:
      - "3001:3000"
    volumes:
      - ./contracts/orders-service.yml:/app/contract.yml
    command: stub /app/contract.yml --port 3000

  tickets-mock:
    image: specmatic/specmatic:latest
    ports:
      - "3002:3000"
    volumes:
      - ./contracts/tickets-service.yml:/app/contract.yml
    command: stub /app/contract.yml --port 3000

  auth-mock:
    image: specmatic/specmatic:latest
    ports:
      - "3003:3000"
    volumes:
      - ./contracts/auth-service.yml:/app/contract.yml
    command: stub /app/contract.yml --port 3000
```

### 4. Environment Configuration

**Different configs for different scenarios:**

```bash
# payments/.env.local (development with mocks)
ORDERS_SERVICE_URL=http://localhost:3001
TICKETS_SERVICE_URL=http://localhost:3002
AUTH_SERVICE_URL=http://localhost:3003

# payments/.env.dev (connect to shared dev)
ORDERS_SERVICE_URL=http://ticketing.dev/api/orders
TICKETS_SERVICE_URL=http://ticketing.dev/api/tickets
AUTH_SERVICE_URL=http://ticketing.dev/api/users

# payments/.env.test (integration tests)
ORDERS_SERVICE_URL=http://orders-test:3000
TICKETS_SERVICE_URL=http://tickets-test:3000
AUTH_SERVICE_URL=http://auth-test:3000
```

### 5. Frontend Development with Mocked Services

**Frontend team can work independently:**

```bash
# Frontend developer workflow:

# Terminal 1: Start all mock services
docker-compose -f docker-compose.contracts.yml up

# Terminal 2: Start frontend
cd client
pnpm dev

# Frontend calls:
# - http://localhost:3001/api/orders (mock)
# - http://localhost:3002/api/tickets (mock)
# - http://localhost:3003/api/users (mock)
# - http://localhost:3004/api/payments (mock, if needed)
```

**Benefits:**
- ✅ Frontend team works independently
- ✅ No need for backend services
- ✅ Fast iteration
- ✅ Test error scenarios easily

## Complete Example: Payments Team Workflow

### Morning Setup

```bash
# 1. Start local infrastructure
pnpm local:up

# 2. Start contract mocks
docker-compose -f docker-compose.contracts.yml up -d

# 3. Build common
pnpm build:common

# 4. Start payments service
cd payments
pnpm start
```

### During Development

```typescript
// You're working on payments service
// It calls orders service (mocked via Specmatic)

const order = await axios.post(
  process.env.ORDERS_SERVICE_URL,  // http://localhost:3001 (mock)
  { ticketId: '123', userId: 'user-1' }
);

// Specmatic returns response based on contract
// You can test different scenarios
```

### Testing UI

```bash
# Start frontend
cd client
pnpm dev

# Frontend at http://localhost:3002
# Calls:
#   - payments (real, localhost:3000)
#   - orders (mock, localhost:3001)
#   - tickets (mock, localhost:3002)
#   - auth (mock, localhost:3003)

# You can test full user flow!
```

### Before Committing

```bash
# 1. Unit tests
pnpm test --filter payments

# 2. Contract tests
pnpm test:contracts --filter payments

# 3. Integration tests with mocks
pnpm test:integration --filter payments
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci-payments.yaml
jobs:
  test:
    - run: pnpm test --filter payments
    - run: pnpm test:contracts --filter payments

  integration:
    - run: docker-compose -f docker-compose.contracts.yml up -d
    - run: pnpm test:integration --filter payments

  integration-real:
    - run: skaffold run --profile=test
    - run: pnpm test:integration-real --filter payments
```

## Turborepo Dependency Scenarios

### Scenario 1: You change `common/src/events/order-created-event.ts`

**Used by:** orders, payments, tickets

**You're working on:** payments

**What Turborepo does:**
```bash
pnpm build --filter payments

# Turborepo:
1. Detects common changed
2. Builds common (payments depends on it)
3. Builds payments
4. Skips orders and tickets (not in filter)
```

**Result:** ✅ Works fine! Payments gets updated common, others don't need rebuild.

### Scenario 2: You change `common/src/events/order-created-event.ts`

**Used by:** orders, payments, tickets

**You run:** `pnpm build` (all packages)

**What Turborepo does:**
```bash
# Turborepo builds in parallel where possible:
1. Builds common first (dependency)
2. Then builds orders, payments, tickets in parallel
```

**Result:** ✅ All services get updated common.

### Scenario 3: You change `payments/src/listeners/order-created-listener.ts`

**Only used by:** payments

**You run:** `pnpm build --filter payments`

**What Turborepo does:**
```bash
# Turborepo:
1. Checks if common changed (no)
2. Uses cached common build
3. Builds only payments
```

**Result:** ✅ Fast! Only payments rebuilt.

## Best Practices Summary

### ✅ DO

1. **Use contract testing** (Specmatic, Pact, etc.)
   - Define contracts first
   - Generate mocks from contracts
   - Test against contracts

2. **Mock other services during development**
   - Fast iteration
   - Work independently
   - Test error scenarios

3. **Use Turborepo for dependency management**
   - Automatic dependency detection
   - Smart caching
   - Parallel builds

4. **Staged testing approach**
   - Unit → Contract → Integration (mocks) → Integration (real) → E2E

5. **Clear team boundaries**
   - Each team owns their service
   - Coordinate through contracts
   - Independent deployment

### ❌ DON'T

1. **Don't skip contract testing**
   - Contracts are your API documentation
   - Catch breaking changes early

2. **Don't run all services locally**
   - Too heavy
   - Use mocks instead

3. **Don't ignore dependency changes**
   - Turborepo handles this, but be aware
   - Test after common package changes

4. **Don't break contracts**
   - Use versioning for breaking changes
   - Coordinate with other teams

## Tools and Setup

### Recommended Stack

- **Contract Testing:** Specmatic, Pact, or OpenAPI + WireMock
- **Monorepo:** Turborepo (you have this!)
- **Package Manager:** pnpm (you have this!)
- **Mocking:** Specmatic stubs, WireMock, or MSW
- **Testing:** Jest, Vitest
- **CI/CD:** GitHub Actions (you have this!)

### Quick Setup Script

```bash
#!/bin/bash
# scripts/dev-with-mocks.sh

echo "🚀 Starting development environment with mocks..."

# Start infrastructure
pnpm local:up

# Start contract mocks
docker-compose -f docker-compose.contracts.yml up -d

# Build common
pnpm build:common

# Start your service
SERVICE=${1:-payments}
cd $SERVICE && pnpm start
```

## Conclusion

**Real-world microservices development:**
- ✅ Teams work independently
- ✅ Use contract testing for coordination
- ✅ Mock other services during development
- ✅ Test UI with mocked services
- ✅ Turborepo handles dependencies automatically
- ✅ Staged testing approach

**Your workflow:**
1. Define contracts
2. Generate mocks from contracts
3. Develop service with mocked dependencies
4. Test UI with mocked services
5. Run integration tests in CI/CD
6. Deploy independently

This is how companies like Netflix, Uber, and Amazon develop microservices at scale!
