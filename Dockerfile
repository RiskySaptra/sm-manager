# 1. Builder stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install pnpm and then install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the application
RUN pnpm run build

# 2. Production stage
FROM node:20-alpine

# Set NODE_ENV environment variable
ENV NODE_ENV production

WORKDIR /usr/src/app

# Copy the built application and production dependencies from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install production dependencies only
RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile

# Expose the port the app runs on (defaulting to 3000 from main.ts)
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]