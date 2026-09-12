FROM node:alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.9.0 --activate

WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Copy common package (dependency)
COPY common/package.json ./common/
COPY common/src ./common/src
COPY common/tsconfig.json ./common/

# Copy payments service
COPY payments/package.json ./payments/
COPY payments/src ./payments/src
COPY payments/tsconfig.json ./payments/

# Install dependencies for payments service only
RUN pnpm install --filter payments... --prod --frozen-lockfile
RUN pnpm --filter @ethtickets/common build

WORKDIR /app/payments

CMD ["pnpm", "start"]
