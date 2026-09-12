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

# Copy auth service
COPY auth/package.json ./auth/
COPY auth/src ./auth/src
COPY auth/tsconfig.json ./auth/

# Install dependencies for auth service only
RUN pnpm install --filter auth... --prod --frozen-lockfile
RUN pnpm --filter @ethtickets/common build

WORKDIR /app/auth

CMD ["pnpm", "start"]
