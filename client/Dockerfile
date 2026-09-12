FROM node:alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.9.0 --activate

WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Copy client
COPY client/package.json ./client/
COPY client/next.config.js ./client/
COPY client/postcss.config.js ./client/
COPY client/tailwind.config.ts ./client/
COPY client/tsconfig.json ./client/
COPY client/public ./client/public
COPY client/app ./client/app
COPY client/src ./client/src
COPY client/styles ./client/styles
COPY client/api ./client/api

# Install dependencies for client only
RUN pnpm install --filter client --prod --frozen-lockfile

WORKDIR /app/client

# Build Next.js app
RUN pnpm run build

CMD ["pnpm", "start"]
