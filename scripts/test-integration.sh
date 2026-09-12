#!/bin/bash

# Integration test script
# Runs integration tests for a service against shared test environment
# Usage: ./scripts/test-integration.sh <service-name>

if [ -z "$1" ]; then
  echo "❌ Error: Service name required"
  echo "Usage: ./scripts/test-integration.sh <service-name>"
  exit 1
fi

SERVICE=$1

echo "🧪 Running integration tests for $SERVICE"
echo ""

# Build common and service
echo "📦 Building dependencies..."
pnpm build:common
pnpm build --filter $SERVICE

# Run integration tests
echo "🧪 Running integration tests..."
pnpm --filter $SERVICE test:integration

if [ $? -eq 0 ]; then
  echo "✅ Integration tests passed"
else
  echo "❌ Integration tests failed"
  exit 1
fi
