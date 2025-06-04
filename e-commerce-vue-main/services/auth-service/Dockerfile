FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:18-alpine 

WORKDIR /app

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./

COPY --from=builder /app/jest.config.cjs ./

COPY --from=builder /app/tests ./tests
RUN chown -R appuser:appgroup /app

ENV NODE_ENV=production

EXPOSE 3001

USER appuser

CMD ["node", "src/app.js"]





