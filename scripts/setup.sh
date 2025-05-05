#!/bin/bash

# CodeGen Server Setup Script
echo "🚀 Setting up CodeGen Server development environment..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "npm install -g pnpm"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Check if .env exists, if not create from example
if [ ! -f .env ]; then
    echo "🔐 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️ Please edit the .env file with your configuration"
fi

# Generate Prisma client
echo "🗃️ Generating Prisma client..."
pnpx prisma generate

# Ask if user wants to run migrations
read -p "Do you want to run database migrations? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Running database migrations..."
    pnpx prisma migrate deploy
fi

# Build the project
echo "🏗️ Building the project..."
pnpm build

echo "✅ Setup complete! You can now start the server with:"
echo "pnpm dev" 