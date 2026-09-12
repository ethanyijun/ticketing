#!/bin/bash

# Development script with contract mocks
# Usage: ./scripts/dev-with-mocks.sh <service-name>
# Example: ./scripts/dev-with-mocks.sh payments

if [ -z "$1" ]; then
  echo "❌ Error: Service name required"
  echo "Usage: ./scripts/dev-with-mocks.sh <service-name>"
  echo "Available services: auth, tickets, orders, payments, expiration, email-service, client"
  exit 1
fi

SERVICE=$1

echo "🚀 Starting development environment with contract mocks for $SERVICE"
echo ""

# Check if service exists
if [ ! -d "$SERVICE" ]; then
  echo "❌ Error: Service '$SERVICE' not found"
  exit 1
fi

# Start local infrastructure
echo "🐳 Starting local infrastructure (MongoDB, Redis, Kafka)..."
pnpm local:up

if [ $? -ne 0 ]; then
  echo "❌ Failed to start local infrastructure"
  exit 1
fi

# Start contract mocks
echo "📋 Starting contract mock servers..."
pnpm mocks:up

if [ $? -ne 0 ]; then
  echo "⚠️  Warning: Failed to start contract mocks"
  echo "   Make sure contracts/ directory exists with contract files"
  echo "   You can continue without mocks, but other services won't be available"
fi

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Build common package
echo "📦 Building common package..."
pnpm build:common

if [ $? -ne 0 ]; then
  echo "❌ Failed to build common package"
  exit 1
fi

# Start the service
echo "🎯 Starting $SERVICE service..."
echo ""
echo "✅ Setup complete!"
echo ""
echo "Your service: http://localhost:3000"
echo "Mock services:"
echo "  - Orders: http://localhost:3001"
echo "  - Tickets: http://localhost:3002"
echo "  - Auth: http://localhost:3003"
echo "  - Expiration: http://localhost:3004"
echo "  - Email: http://localhost:3005"
echo ""
echo "Configure your service to use mock URLs:"
echo "  ORDERS_SERVICE_URL=http://localhost:3001"
echo "  TICKETS_SERVICE_URL=http://localhost:3002"
echo "  AUTH_SERVICE_URL=http://localhost:3003"
echo ""

cd $SERVICE
pnpm start
