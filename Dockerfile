FROM node:20-alpine AS builder
WORKDIR /app

# Build client
COPY client/package*.json ./client/
RUN cd client && npm ci
COPY client ./client
RUN cd client && npm run build

# Install server deps
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev
COPY server ./server

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist
RUN mkdir -p uploads

ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server/index.js"]
