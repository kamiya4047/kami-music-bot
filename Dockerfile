FROM oven/bun:1-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/bot

COPY . .

RUN bun install --frozen-lockfile

ENV NODE_ENV=production

RUN bun run build

USER bun
CMD ["bun", "run", "./dist/index.js"]