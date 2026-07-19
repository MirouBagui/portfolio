# Client build
FROM node:22-alpine AS client
WORKDIR /client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Server build (deps are hoisted to the root package.json)
FROM node:22-alpine AS server
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY server/ server/
RUN npm run build --prefix server

# Runtime
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=server /app/server/dist ./server/dist
COPY --from=client /client/dist ./server/dist/public
USER node
EXPOSE 3000
CMD ["node", "server/dist/main.js"]
