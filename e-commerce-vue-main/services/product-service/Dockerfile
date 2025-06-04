FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:18-alpine

WORKDIR /app

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src

ENV NODE_ENV=production

RUN npm install --only=production

EXPOSE 3000

USER appuser

CMD ["node", "src/app.js"]
