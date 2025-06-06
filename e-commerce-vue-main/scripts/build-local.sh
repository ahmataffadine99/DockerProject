#!/bin/bash

# Script pour builder toutes les images localement
set -e

echo "🏗️ Building all Docker images locally..."

# Variables
TAG="local-$(date +%Y%m%d-%H%M%S)"
REPO="ecommerce"

# Build auth-service
echo "📦 Building auth-service..."
docker build -t "$REPO/auth-service:$TAG" \
             -t "$REPO/auth-service:latest" \
             ./services/auth-service

# Build product-service
echo "📦 Building product-service..."
docker build -t "$REPO/product-service:$TAG" \
             -t "$REPO/product-service:latest" \
             ./services/product-service

# Build order-service
echo "📦 Building order-service..."
docker build -t "$REPO/order-service:$TAG" \
             -t "$REPO/order-service:latest" \
             ./services/order-service

# Build frontend
echo "📦 Building frontend..."
docker build -t "$REPO/frontend:$TAG" \
             -t "$REPO/frontend:latest" \
             ./frontend

echo ""
echo "🎉 All images built successfully!"
echo "📋 Images built:"
docker images | grep "$REPO"

echo ""
echo "🧪 Run tests with: ./scripts/test-local.sh"