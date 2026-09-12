# API Contracts

This directory contains OpenAPI/Swagger contracts for all microservices.

## Purpose

Contracts define the API agreements between services:
- Request/response formats
- Endpoints
- Error handling
- Event schemas

## Usage

### Generate Mock Servers

```bash
# Start all mock servers
docker-compose -f docker-compose.contracts.yml up

# Or use Specmatic directly
specmatic stub contracts/orders-service.yml --port 3001
```

### Contract Testing

```bash
# Test service against contract
pnpm test:contracts --filter payments
```

## Contract Files

- `orders-service.yml` - Orders service API
- `tickets-service.yml` - Tickets service API
- `auth-service.yml` - Auth service API
- `payments-service.yml` - Payments service API
- `expiration-service.yml` - Expiration service API
- `email-service.yml` - Email service API

## Best Practices

1. **Define contracts first** (contract-first development)
2. **Version contracts** when making breaking changes
3. **Keep contracts in sync** with actual implementations
4. **Use contracts for documentation**
5. **Generate mocks from contracts**

## Tools

- **Specmatic**: Contract testing and mocking
- **Pact**: Consumer-driven contracts
- **OpenAPI**: API specification standard
- **WireMock**: HTTP mocking
