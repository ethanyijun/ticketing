# Migration to pnpm + Turborepo

This document outlines the migration from npm to pnpm workspaces with Turborepo.

## What Changed

### 1. Package Manager
- **Before**: npm with individual `package-lock.json` files
- **After**: pnpm with workspace protocol and single `pnpm-lock.yaml`

### 2. Monorepo Tooling
- **Added**: Turborepo for task orchestration and caching
- **Configuration**: `turbo.json` defines the build pipeline

### 3. Workspace Protocol
- **Before**: `@ethtickets/common` was published to npm and installed via version numbers
- **After**: Uses `workspace:*` protocol for local development (still publishes to npm for production)

### 4. Dockerfiles
- All Dockerfiles updated to use pnpm
- Now copy workspace files and use `pnpm install --filter` for service-specific installs

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0 (install via `npm install -g pnpm` or use corepack)

### Initial Setup

1. **Install pnpm** (if not already installed):
   ```bash
   npm install -g pnpm
   # OR use corepack (comes with Node.js 16.9+)
   corepack enable
   corepack prepare pnpm@latest --activate
   ```

2. **Remove old lock files and node_modules**:
   ```bash
   find . -name "package-lock.json" -delete
   find . -name "node_modules" -type d -exec rm -rf {} +
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

## Common Tasks

### Build all packages
```bash
pnpm build
# or
turbo build
```

### Run all services in development
```bash
pnpm dev
# or run specific service
pnpm --filter auth dev
```

### Run tests
```bash
pnpm test          # Watch mode
pnpm test:ci       # CI mode (no watch)
```

### Build specific package
```bash
pnpm --filter @ethtickets/common build
pnpm --filter client build
```

### Add dependency to specific package
```bash
pnpm --filter auth add express
pnpm --filter client add -D @types/node
```

### Add dependency to root (shared dev dependencies)
```bash
pnpm add -D -w typescript
```

## Publishing Common Package

The `common` package is still published to npm. To publish:

```bash
./publishCommon.sh
```

This will:
1. Build and publish `@ethtickets/common` to npm
2. Update all workspace dependencies to use the published version

**Note**: For local development, services use `workspace:*` which points to the local common package. After publishing, you may want to update services to use the published version if needed.

## Turborepo Benefits

1. **Caching**: Build outputs are cached, making subsequent builds faster
2. **Parallel Execution**: Tasks run in parallel when possible
3. **Dependency Graph**: Automatically determines build order based on dependencies
4. **Filtering**: Run tasks only for affected packages

### Example: Run build only for changed packages
```bash
turbo build --filter=...[origin/main]
```

## Turborepo with Docker/K8s/Skaffold

Since you're using Docker, Kubernetes, and Skaffold, see [TURBOREPO_DOCKER_K8S.md](./TURBOREPO_DOCKER_K8S.md) for detailed information on how Turborepo integrates with your deployment stack.

**Quick summary**: Turborepo optimizes the **build/test phase** before Docker builds, while Docker/K8s handles the **deployment phase**. This provides:
- Faster Docker builds (pre-compiled TypeScript)
- Parallel test execution in CI/CD
- Smart caching across CI runs
- Better local development workflow

## Docker Builds

Docker builds now:
1. Copy workspace configuration files
2. Copy the `common` package (dependency)
3. Copy the specific service
4. Use `pnpm install --filter` to install only needed dependencies

This ensures smaller Docker images and faster builds.

## Troubleshooting

### Issue: `pnpm: command not found`
**Solution**: Install pnpm globally or enable corepack:
```bash
corepack enable
```

### Issue: Workspace protocol not resolving
**Solution**: Make sure you're running `pnpm install` from the root directory

### Issue: Build fails with "common not found"
**Solution**: Ensure `common` package is built first:
```bash
pnpm --filter @ethtickets/common build
```

### Issue: Docker build fails
**Solution**: Ensure Dockerfile context is set correctly. The Dockerfiles expect to be run from the repository root, not from within the service directory.

## Migration Checklist

- [x] Root `package.json` with workspace configuration
- [x] `pnpm-workspace.yaml` created
- [x] `turbo.json` configured
- [x] All services updated to use `workspace:*` for common
- [x] All Dockerfiles updated to use pnpm
- [x] `.gitignore` updated for pnpm and Turborepo
- [x] `publishCommon.sh` updated to use pnpm

## Next Steps

1. Run `pnpm install` to generate `pnpm-lock.yaml`
2. Test builds: `pnpm build`
3. Test development: `pnpm dev`
4. Update CI/CD pipelines to use pnpm
5. Update any documentation referencing npm commands
