#!/bin/bash

# Build common package before starting Skaffold
echo "🔨 Building common package..."
pnpm build:common

if [ $? -ne 0 ]; then
  echo "❌ Failed to build common package"
  exit 1
fi

echo "🚀 Starting Skaffold..."
skaffold dev
