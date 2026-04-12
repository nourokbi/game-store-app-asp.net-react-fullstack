# Build stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Allows: docker build --build-arg VITE_API_BASE_URL=http://host.docker.internal:5277 .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY . .
RUN npm run build

# Runtime stage (simple static server)
FROM node:20-alpine
WORKDIR /app
RUN npm i -g serve

COPY --from=build /app/dist ./dist
EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
