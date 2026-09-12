FROM node:22-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm prisma generate && pnpm build
EXPOSE 3000
CMD ["sh", "-c", "pnpm prisma db push && pnpm db:seed && pnpm start"]
