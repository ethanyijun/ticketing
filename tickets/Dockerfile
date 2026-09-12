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

# Copy tickets service
COPY tickets/package.json ./tickets/
COPY tickets/src ./tickets/src
COPY tickets/tsconfig.json ./tickets/

# Install dependencies for tickets service only
RUN pnpm install --filter tickets... --prod --frozen-lockfile
RUN pnpm --filter @ethtickets/common build

WORKDIR /app/tickets

CMD ["pnpm", "start"]
