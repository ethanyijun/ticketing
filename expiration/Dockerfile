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

# Copy expiration service
COPY expiration/package.json ./expiration/
COPY expiration/src ./expiration/src
COPY expiration/tsconfig.json ./expiration/

# Install dependencies for expiration service only
RUN pnpm install --filter expiration... --prod --frozen-lockfile
RUN pnpm --filter @ethtickets/common build

WORKDIR /app/expiration

CMD ["pnpm", "start"]
