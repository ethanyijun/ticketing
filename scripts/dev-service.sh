#!/bin/bash

# Helper script for teams to run their service locally
# Usage: ./scripts/dev-service.sh <service-name>
# Example: ./scripts/dev-service.sh payments

if [ -z "$1" ]; then
  echo "❌ Error: Service name required"
  echo "Usage: ./scripts/dev-service.sh <service-name>"
  echo "Available services: auth, tickets, orders, payments, expiration, email-service, client"
  exit 1
fi

SERVICE=$1

echo "🚀 Starting local development for $SERVICE"
echo ""

# Check if service exists
if [ ! -d "$SERVICE" ]; then
  echo "❌ Error: Service '$SERVICE' not found"
  exit 1
fi

# Build common package first
echo "📦 Building common package..."
pnpm build:common

if [ $? -ne 0 ]; then
  echo "❌ Failed to build common package"
  exit 1
fi

# Start local dependencies
echo "🐳 Starting local dependencies (MongoDB, Redis, Kafka)..."
docker-compose -f docker-compose.local.yml up -d

if [ $? -ne 0 ]; then
  echo "❌ Failed to start local dependencies"
  exit 1
fi

# Wait for services to be healthy
echo "⏳ Waiting for dependencies to be ready..."
sleep 5

# Start the service
echo "🎯 Starting $SERVICE service..."
cd $SERVICE
pnpm start
