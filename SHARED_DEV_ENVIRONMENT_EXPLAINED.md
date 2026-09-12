# What is a "Shared Dev Environment"?

## The Concept

A **shared dev environment** is a **separate deployment** of all your microservices running in a **Kubernetes cluster** (or cloud platform) that all developers can connect to.

Think of it like this:

```
Your Local Machine          Shared Dev Environment (K8s Cluster)
┌─────────────────┐         ┌─────────────────────────────────┐
│                 │         │                                 │
│  payments       │────────▶│  orders (running)              │
│  (your service) │  HTTP   │  tickets (running)              │
│                 │         │  auth (running)                 │
│  MongoDB        │         │  payments (running)              │
│  Redis          │         │  expiration (running)           │
│  Kafka          │         │  email-service (running)        │
│  (local)        │         │                                 │
│                 │         │  + MongoDB cluster              │
│                 │         │  + Redis cluster                │
│                 │         │  + Kafka cluster                 │
└─────────────────┘         └─────────────────────────────────┘
```

## Real-World Example

### Scenario: You're on the Payments Team

**On your local machine:**
```bash
# You run:
- payments service (your code)
- MongoDB (local, via docker-compose)
- Redis (local, via docker-compose)
- Kafka (local, via docker-compose)
```

**In the shared dev environment (Kubernetes cluster):**
```bash
# Already running (deployed by CI/CD or platform team):
- orders service → http://orders.dev.company.com
- tickets service → http://tickets.dev.company.com
- auth service → http://auth.dev.company.com
- expiration service → http://expiration.dev.company.com
- email-service → http://email.dev.company.com
- client (frontend) → http://client.dev.company.com
```

**Your payments service connects to them:**
```typescript
// payments/src/config.ts
export const ORDERS_SERVICE_URL = process.env.ORDERS_SERVICE_URL
  || 'http://orders.dev.company.com';  // Shared dev environment

export const TICKETS_SERVICE_URL = process.env.TICKETS_SERVICE_URL
  || 'http://tickets.dev.company.com';  // Shared dev environment
```

## How It Works

### 1. Shared Dev Environment Setup

**Infrastructure:**
- Kubernetes cluster (could be on AWS EKS, GCP GKE, Azure AKS, or local like minikube)
- All services deployed and running
- Services accessible via URLs or service names

**Example Kubernetes setup:**
```yaml
# infra/k8s/orders-depl.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: orders-depl
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: orders
        image: ethangai/orders:latest
        ports:
        - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: orders-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: orders
```

**Access:**
- Via Kubernetes service names: `http://orders-service.default.svc.cluster.local`
- Via external URLs: `http://orders.dev.company.com` (with ingress)
- Via port-forwarding: `kubectl port-forward svc/orders-service 3000:80`

### 2. Your Local Service Connects

```bash
# payments/.env.local
ORDERS_SERVICE_URL=http://orders.dev.company.com
TICKETS_SERVICE_URL=http://tickets.dev.company.com
AUTH_SERVICE_URL=http://auth.dev.company.com
```

```typescript
// payments/src/services/orders-client.ts
import axios from 'axios';

const ORDERS_URL = process.env.ORDERS_SERVICE_URL;

export async function createOrder(data: any) {
  // This calls the REAL orders service in shared dev
  const response = await axios.post(`${ORDERS_URL}/api/orders`, data);
  return response.data;
}
```

## Why Use a Shared Dev Environment?

### ✅ Benefits

1. **Real Integration Testing**
   - Test against actual services, not mocks
   - Catch integration issues early
   - Services are always up-to-date

2. **Resource Efficiency**
   - Don't need to run 7 services locally
   - Saves CPU, memory, disk space
   - Faster startup time

3. **Team Independence**
   - Each team works on their service
   - Don't need to coordinate with other teams
   - Other services keep running even if you're offline

4. **Consistent Environment**
   - Same environment for all developers
   - Easier to debug issues
   - Reproducible problems

### ❌ Without Shared Dev Environment

**You'd have to:**
- Run all 7 services locally (heavy!)
- Mock other services (can get stale)
- Coordinate with other teams
- Deal with port conflicts

## How Services Get Deployed to Shared Dev

### Option 1: Automatic Deployment (CI/CD)

```yaml
# .github/workflows/deploy-to-dev.yaml
name: Deploy to Dev

on:
  push:
    branches:
      - develop

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Build and push Docker image
      - run: docker build -t ethangai/orders:${{ github.sha }} .
      - run: docker push ethangai/orders:${{ github.sha }}

      # Deploy to dev Kubernetes cluster
      - run: kubectl set image deployment/orders-depl orders=ethangai/orders:${{ github.sha }}
      - run: kubectl rollout status deployment/orders-depl
```

**Result:** Every push to `develop` branch automatically updates services in shared dev.

### Option 2: Manual Deployment

```bash
# Platform team or developer manually deploys
skaffold run --profile=dev

# Or using kubectl directly
kubectl apply -f infra/k8s/orders-depl.yaml
```

### Option 3: GitOps (ArgoCD/Flux)

```yaml
# GitOps automatically syncs from git repo
# When you merge to develop branch, ArgoCD deploys to dev
```

## Different Environment Types

### Typical Setup

```
┌─────────────────────────────────────────────────────────┐
│ Local Development                                        │
│ - Your service runs locally                             │
│ - Connects to shared dev for other services             │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ Shared Dev Environment (dev.company.com)                 │
│ - All services deployed                                  │
│ - Used by all developers                                 │
│ - Auto-deployed from develop branch                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ Staging Environment (staging.company.com)                │
│ - Production-like environment                            │
│ - Used for integration testing                           │
│ - Auto-deployed from main branch                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ Production Environment (company.com)                     │
│ - Live production services                               │
│ - Deployed from release tags                             │
└─────────────────────────────────────────────────────────┘
```

## Practical Example: Payments Team Workflow

### Morning Setup

```bash
# 1. Start local dependencies
pnpm local:up
# Starts: MongoDB, Redis, Kafka (local)

# 2. Build common
pnpm build:common

# 3. Start payments service locally
cd payments
pnpm start
# Payments service runs on localhost:3000
```

### During Development

```typescript
// You're working on payments service
// When you need to call orders service:

const order = await axios.post(
  'http://orders.dev.company.com/api/orders',  // Shared dev!
  { ticketId: '123', userId: 'user-1' }
);

// This calls the REAL orders service running in shared dev
// Not a mock, not local - the actual service!
```

### What Happens Behind the Scenes

```
Your Request Flow:

1. payments (localhost:3000)
   └─▶ HTTP POST to orders.dev.company.com
       └─▶ Kubernetes Ingress
           └─▶ orders-service (LoadBalancer)
               └─▶ orders-depl (Pod)
                   └─▶ orders container (running orders service)
                       └─▶ Returns response
                           └─▶ Back to your payments service
```

## Setting Up Shared Dev Environment

### For Your Project

**Option 1: Use Skaffold to Deploy**

```bash
# Deploy all services to local Kubernetes (minikube/kind)
skaffold run --profile=dev

# Or to remote cluster
skaffold run --profile=dev --default-repo=your-registry
```

**Option 2: Manual Kubernetes Deployment**

```bash
# Apply all Kubernetes manifests
kubectl apply -f infra/k8s/

# Set up ingress for external access
kubectl apply -f infra/k8s-dev/ingress-srv.yaml
```

**Option 3: Use Your Existing CI/CD**

Your GitHub Actions workflows already deploy services. You could:
- Create a `dev` environment
- Deploy to it on push to `develop` branch
- All developers connect to it

## Accessing Shared Dev Services

### Method 1: External URLs (with Ingress)

```yaml
# infra/k8s-dev/ingress-srv.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: dev-ingress
spec:
  rules:
  - host: orders.dev.company.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: orders-service
            port:
              number: 80
```

**Access:** `http://orders.dev.company.com`

### Method 2: Port Forwarding

```bash
# Forward orders service to localhost
kubectl port-forward svc/orders-service 3001:80

# Access: http://localhost:3001
```

### Method 3: Kubernetes Service DNS

```typescript
// Inside Kubernetes cluster
const url = 'http://orders-service.default.svc.cluster.local';
```

## Environment Variables Setup

### For Local Development

```bash
# payments/.env.local

# Local services
MONGODB_URL=mongodb://localhost:27017/payments
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092

# Shared dev services
ORDERS_SERVICE_URL=http://orders.dev.company.com
TICKETS_SERVICE_URL=http://tickets.dev.company.com
AUTH_SERVICE_URL=http://auth.dev.company.com
EXPIRATION_SERVICE_URL=http://expiration.dev.company.com
EMAIL_SERVICE_URL=http://email.dev.company.com
```

## Summary

**Shared Dev Environment = A Kubernetes cluster where all services are deployed and running, accessible to all developers.**

**Key Points:**
- ✅ Separate from your local machine
- ✅ All services running (except the one you're developing)
- ✅ Accessible via URLs or service names
- ✅ Auto-updated via CI/CD
- ✅ Used by all developers
- ✅ Real services, not mocks

**Your workflow:**
1. Run your service locally
2. Run local infrastructure (DB, queues)
3. Connect to other services in shared dev
4. Test against real services
5. Fast, efficient, realistic testing

This is the standard approach used by companies like Netflix, Uber, and Amazon for microservices development!
