#!/bin/bash

# Script pour tester les images localement
set -e

echo "🧪 Testing Docker images locally..."

REPO="ecommerce"

# Test auth-service
echo "Testing auth-service..."
docker run -d --name test-auth -p 3001:3001 \
    -e NODE_ENV=development \
    -e MONGODB_URI=mongodb://localhost:27017/test \
    "$REPO/auth-service:latest"
sleep 5

if curl -f http://localhost:3001/health; then
    echo "✅ auth-service OK"
else
    echo "❌ auth-service FAILED"
fi

docker stop test-auth && docker rm test-auth

# Test product-service
echo "Testing product-service..."
docker run -d --name test-product -p 3000:3000 \
    -e NODE_ENV=development \
    -e MONGODB_URI=mongodb://localhost:27017/test \
    "$REPO/product-service:latest"
sleep 5

if curl -f http://localhost:3000/health; then
    echo "✅ product-service OK"
else
    echo "❌ product-service FAILED"
fi

docker stop test-product && docker rm test-product

# Test order-service
echo "Testing order-service..."
docker run -d --name test-order -p 3002:3002 \
    -e NODE_ENV=development \
    -e MONGODB_URI=mongodb://localhost:27017/test \
    -e JWT_SECRET=test_secret \
    "$REPO/order-service:latest"
sleep 5

if curl -f http://localhost:3002/health; then
    echo "✅ order-service OK"
else
    echo "❌ order-service FAILED"
fi

docker stop test-order && docker rm test-order

# Test frontend
echo "Testing frontend..."
docker run -d --name test-frontend -p 8080:80 \
    "$REPO/frontend:latest"
sleep 5

if curl -f http://localhost:8080; then
    echo "✅ frontend OK"
else
    echo "❌ frontend FAILED"
fi

docker stop test-frontend && docker rm test-frontend

echo "🎉 All tests completed!"