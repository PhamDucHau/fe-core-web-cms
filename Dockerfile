# --- Stage 1: Build app ---
FROM node:20 AS build

WORKDIR /app

# Copy dependency files
COPY package.json ./

# Cài dependency qua Yarn (giữ nguyên phiên bản)
RUN yarn install --frozen-lockfile

# Copy toàn bộ project
COPY . .

# Build production
RUN yarn build


# --- Stage 2: Production runtime ---
FROM node:20 AS production

WORKDIR /app

# Chỉ copy output đã build (giảm dung lượng)
COPY --from=build /app ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["yarn", "start"]
