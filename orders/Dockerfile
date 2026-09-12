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

# Copy orders service
COPY orders/package.json ./orders/
COPY orders/src ./orders/src
COPY orders/tsconfig.json ./orders/

# Install dependencies for orders service only
RUN pnpm install --filter orders... --prod --frozen-lockfile
RUN pnpm --filter @ethtickets/common build

WORKDIR /app/orders

CMD ["pnpm", "start"]
