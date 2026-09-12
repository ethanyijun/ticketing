# Turborepo + Skaffold: Local Development Reality Check

## The Honest Answer

For **local development with `skaffold dev`**, Turborepo provides **limited but important** value:

### ✅ What Turborepo DOES Help With

#### 1. **Ensuring `common` is Built First** (Critical!)
Your `common` package has:
```json
"main": "./build/index.js"  // Points to built version
```

When services import `@ethtickets/common`, Node.js resolves to `common/build/index.js`. **If `common` isn't built, services will fail to start.**

**Without Turborepo:**
```bash
skaffold dev  # ❌ Services fail because common/build/ doesn't exist
```

**With Turborepo:**
```bash
pnpm build --filter @ethtickets/common  # Build common first
skaffold dev  # ✅ Services can start
```

#### 2. **Watching `common` for Changes**
When you modify `common/src/`, you need to rebuild it. Turborepo can watch and rebuild:

```bash
# Terminal 1: Watch common
pnpm build --filter @ethtickets/common --watch

# Terminal 2: Skaffold
skaffold dev
```

#### 3. **Dependency Management**
Turborepo ensures correct build order automatically:
- If you change `common`, it rebuilds before dependent services
- No manual "build common first" steps

### ❌ What Turborepo DOESN'T Help With (Skaffold Already Does)

- **File syncing**: Skaffold handles this
- **Docker rebuilds**: Skaffold triggers these
- **K8s deployment**: Skaffold handles this
- **Hot reload**: `ts-node-dev` handles this for services

## Practical Workflow Options

### Option 1: Manual Build Before Skaffold (Current Reality)
```bash
# Build common once
pnpm build --filter @ethtickets/common

# Start Skaffold
skaffold dev

# When you change common, rebuild manually
pnpm build --filter @ethtickets/common
```

**Pros**: Simple, works
**Cons**: Manual step, easy to forget

### Option 2: Watch Mode + Skaffold (Recommended)
```bash
# Terminal 1: Watch and rebuild common
pnpm build --filter @ethtickets/common --watch

# Terminal 2: Skaffold
skaffold dev
```

**Pros**: Automatic rebuilds when common changes
**Cons**: Two terminals

### Option 3: Pre-Skaffold Script (Best for Automation) ✅
A script is already created that builds common before starting Skaffold:

```bash
# Use the provided script
./scripts/dev.sh

# Or use the npm script
pnpm skaffold:dev
```

Both will:
1. Build `common` package first
2. Start Skaffold if build succeeds

### Option 4: Skaffold Pre-Build Hook (Advanced)
You could add a pre-build hook to Skaffold, but it's complex and not recommended.

## The Real Value: CI/CD and Testing

Where Turborepo **really** shines for your setup:

### 1. **CI/CD Pipelines**
```yaml
# Before Docker builds
- run: pnpm build  # Builds common + affected packages in parallel
- run: pnpm test:ci --filter=...[origin/main]  # Tests only changed packages
- run: docker build ...  # Faster because packages are pre-built
```

### 2. **Pre-commit Hooks**
```bash
# Only lint/test what changed
pnpm lint --filter=...[HEAD]
pnpm test --filter=...[HEAD]
```

### 3. **Local Testing**
```bash
# Run all tests in parallel
pnpm test:ci

# Test only affected packages
pnpm test:ci --filter=...[origin/main]
```

## Recommendation

For **local development with Skaffold**:

1. **Use the provided script** (recommended):
   ```bash
   pnpm skaffold:dev
   # or
   ./scripts/dev.sh
   ```

2. **Or use watch mode** in a separate terminal:
   ```bash
   pnpm watch:common  # Watches and rebuilds common when it changes
   # Then in another terminal:
   skaffold dev
   ```

3. **Don't try to integrate Turborepo deeply** with Skaffold - they serve different purposes:
   - **Turborepo**: Build/test orchestration
   - **Skaffold**: Docker/K8s deployment

## Alternative: Source-Based Imports (Advanced)

If you want to avoid building `common` during development, you could:

1. Configure TypeScript path mapping to import from source
2. Use `ts-node-dev` with custom module resolution
3. This is complex and may cause issues

**Not recommended** - the build step is fast and ensures consistency.

## Summary

**For local dev with Skaffold:**
- ✅ Turborepo helps ensure `common` is built
- ✅ Can watch and rebuild `common` automatically
- ❌ Doesn't replace Skaffold's file sync/Docker/K8s features
- ❌ Limited value beyond dependency management

**For CI/CD and testing:**
- ✅ **Major value**: Parallel builds, caching, affected package detection
- ✅ **Significant time savings**: Only build/test what changed

**Bottom line**: Turborepo is more valuable for CI/CD than local dev with Skaffold, but it does solve the "common must be built first" problem elegantly.
