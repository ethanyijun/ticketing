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

# Copy email-service
COPY email-service/package.json ./email-service/
COPY email-service/src ./email-service/src
COPY email-service/tsconfig.json ./email-service/

# Install dependencies for email-service only
RUN pnpm install --filter email... --prod --frozen-lockfile
RUN pnpm --filter @ethtickets/common build

WORKDIR /app/email-service

CMD ["pnpm", "start"]
