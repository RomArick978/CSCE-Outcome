FROM node:22-alpine

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --chown=appuser:appgroup . .

USER appuser

EXPOSE 3000
CMD ["node", "src/index.js"]
