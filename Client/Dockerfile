FROM oven/bun:1-alpine
WORKDIR /app

# Copy dependency manifests
COPY package.json bun.lock* ./
RUN bun install

# Copy application files
COPY . .

# Build the client into the dist directory
RUN bun run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "run", "start"]