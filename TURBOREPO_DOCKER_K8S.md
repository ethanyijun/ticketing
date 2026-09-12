# Turborepo in Docker/K8s/Skaffold Workflow

## Overview

Even though you're using Docker, Kubernetes, and Skaffold for deployment, Turborepo provides significant value in several areas of your development and CI/CD pipeline.

## Where Turborepo Helps

### 1. **Pre-Docker Build Optimization**

**Problem**: Your Dockerfiles need to build the `common` package first, but Docker builds don't have smart caching for TypeScript compilation.

**Solution**: Use Turborepo to build packages **before** Docker builds, leveraging Turborepo's intelligent caching.

```bash
# In CI/CD, before Docker build:
pnpm build                    # Turborepo builds common + affected packages
docker build -f auth/Dockerfile .  # Docker just copies pre-built artifacts
```

**Benefits**:
- ✅ Faster Docker builds (no TypeScript compilation in Docker)
- ✅ Better layer caching (build artifacts are separate from source)
- ✅ Consistent builds across environments

### 2. **CI/CD Pipeline Optimization**

Your GitHub Actions workflows can benefit from Turborepo in several ways:

#### A. **Parallel Test Execution**
Instead of running tests sequentially, Turborepo runs them in parallel:

```yaml
# Current: Sequential
- run: pnpm --filter auth test:ci
- run: pnpm --filter orders test:ci
- run: pnpm --filter payments test:ci

# With Turborepo: Parallel
- run: pnpm test:ci  # Runs all tests in parallel, respecting dependencies
```

#### B. **Smart Caching in CI**
Turborepo caches test results and build outputs:

```yaml
- run: pnpm build --filter=...[origin/main]
  # Only builds packages that changed since main branch
  # Uses remote cache if available
```

#### C. **Affected Package Detection**
Only test/build what changed:

```yaml
# In your test workflows:
- run: pnpm test:ci --filter=...[origin/main]
  # Only runs tests for packages that changed
```

### 3. **Local Development with Skaffold**

Skaffold syncs files, but Turborepo helps with:

#### A. **Building Common Package**
Before Skaffold starts, ensure `common` is built:

```bash
# In your local dev workflow:
pnpm build --filter @ethtickets/common  # Build common first
skaffold dev                            # Then start Skaffold
```

#### B. **Watching Multiple Services**
Run multiple services locally with proper dependency management:

```bash
# Start all services in dev mode (Turborepo handles dependencies)
pnpm dev

# Or start specific services and their dependencies
pnpm dev --filter auth --filter @ethtickets/common
```

### 4. **Docker Build Context Optimization**

Your Dockerfiles copy the entire workspace. Turborepo can help optimize this:

#### Option A: Pre-build in CI (Recommended)
```yaml
# In GitHub Actions, before Docker build:
- run: pnpm build --filter @ethtickets/common
- run: docker build -f auth/Dockerfile .
  # Dockerfile can now copy pre-built common/build instead of compiling
```

#### Option B: Multi-stage Docker Builds with Turbo Cache
You could use Turborepo's remote cache in Docker builds (advanced):

```dockerfile
# Stage 1: Build with Turborepo
FROM node:alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build --filter @ethtickets/common --filter auth

# Stage 2: Runtime
FROM node:alpine
# Copy built artifacts only
```

### 5. **Dependency Graph Management**

Turborepo automatically understands your dependency graph:

```
common (must build first)
  ├── auth (depends on common)
  ├── tickets (depends on common)
  ├── orders (depends on common)
  └── payments (depends on common)
```

**Benefits**:
- ✅ Always builds in correct order
- ✅ Only rebuilds what's necessary
- ✅ Prevents dependency issues

### 6. **Linting and Type Checking**

Run linting/type checking across all packages efficiently:

```bash
# Lint all packages in parallel
pnpm lint

# Type check only affected packages
pnpm type-check --filter=...[origin/main]
```

## Practical Integration Examples

### Example 1: Enhanced CI/CD Workflow

```yaml
# .github/workflows/test-and-deploy.yaml
name: test-and-deploy

on:
  push:
    branches: [master]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "pnpm"

      # Install dependencies
      - run: pnpm install

      # Build common first (Turborepo handles this automatically)
      - run: pnpm build --filter @ethtickets/common

      # Run all tests in parallel (only for changed packages)
      - run: pnpm test:ci --filter=...[origin/main]

      # Lint all packages
      - run: pnpm lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "pnpm"

      - run: pnpm install

      # Build all packages (Turborepo caches this)
      - run: pnpm build

      # Now Docker builds are faster (just copying pre-built artifacts)
      - run: docker build -f auth/Dockerfile -t ethangai/auth .
      - run: docker push ethangai/auth
      # ... deploy to K8s
```

### Example 2: Local Development Script

Create a script that combines Turborepo and Skaffold:

```bash
#!/bin/bash
# scripts/dev.sh

# Build common package first
echo "Building common package..."
pnpm build --filter @ethtickets/common

# Start Skaffold (which will build Docker images)
echo "Starting Skaffold..."
skaffold dev
```

### Example 3: Pre-commit Hooks

Use Turborepo for fast pre-commit checks:

```bash
#!/bin/bash
# .husky/pre-commit

# Only lint/test changed packages
pnpm lint --filter=...[HEAD]
pnpm test --filter=...[HEAD]
```

## Performance Gains

### Without Turborepo:
- ❌ Sequential builds: `common` → `auth` → `tickets` → etc. (slow)
- ❌ Rebuild everything on every change
- ❌ No caching between CI runs
- ❌ Docker builds compile TypeScript every time

### With Turborepo:
- ✅ Parallel builds where possible
- ✅ Only rebuilds what changed
- ✅ Remote caching (can share cache across CI runs)
- ✅ Pre-built artifacts → faster Docker builds

## Recommended Workflow

### For Local Development:
```bash
# 1. Build common package
pnpm build --filter @ethtickets/common

# 2. Start services (Turborepo manages dependencies)
pnpm dev

# OR use Skaffold for K8s deployment
skaffold dev
```

### For CI/CD:
```yaml
# 1. Install dependencies
- run: pnpm install

# 2. Build all packages (with caching)
- run: pnpm build

# 3. Run tests (parallel, only affected)
- run: pnpm test:ci --filter=...[origin/main]

# 4. Build Docker images (faster because packages are pre-built)
- run: docker build -f auth/Dockerfile .
```

## When Turborepo Doesn't Help

Turborepo **doesn't** help with:
- ❌ Docker image layer caching (Docker handles this)
- ❌ Kubernetes deployment orchestration (K8s handles this)
- ❌ Skaffold file syncing (Skaffold handles this)

But it **does** help with:
- ✅ Pre-Docker builds and compilation
- ✅ Test execution and caching
- ✅ Dependency management
- ✅ Local development workflow
- ✅ CI/CD optimization

## Summary

Even with Docker/K8s/Skaffold, Turborepo provides value by:

1. **Optimizing pre-Docker builds** - Build TypeScript before Docker
2. **Parallelizing CI/CD tasks** - Run tests/builds in parallel
3. **Smart caching** - Cache builds and tests across CI runs
4. **Dependency management** - Automatic build ordering
5. **Local development** - Better DX when running multiple services

Think of it as: **Turborepo optimizes the "build/test" phase, Docker/K8s handles the "deploy" phase**.
