# Dockerfile
FROM node:22.10.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./

# ติดตั้ง Prisma CLI และ dependencies
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]