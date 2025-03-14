#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Update package list
echo "Updating package list..."
sudo apt update -y && sudo apt full-upgrade -y

# Install Node.js, npm, and PNPM if not installed
if ! command_exists node; then
    echo "Installing Node.js and npm..."
    sudo apt install -y nodejs npm
else
    echo "Node.js is already installed."
fi

if ! command_exists pnpm; then
    echo "Installing PNPM..."
    npm install -g pnpm
else
    echo "PNPM is already installed."
fi

# Install TypeScript
if ! command_exists tsc; then
    echo "Installing TypeScript..."
    npm install -g typescript
else
    echo "TypeScript is already installed."
fi

# Install MySQL if not installed
if ! command_exists mysql; then
    echo "Installing MySQL..."
    sudo apt install -y mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
    sudo mysql_secure_installation
else
    echo "MySQL is already installed."
fi

# Create Financial Assistant database
echo "Setting up MySQL database..."
sudo mysql -u root -e "CREATE DATABASE IF NOT EXISTS financial_assistant;"

# Install project dependencies (Next.js, Tailwind, and other required packages)
echo "Installing project dependencies..."
pnpm install

# Install Docker
if ! command_exists docker; then
    echo "Installing Docker..."
    sudo apt install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
else
    echo "Docker is already installed."
fi

# Create .gitignore file
echo "Creating .gitignore file..."
if [ ! -f .gitignore ]; then
    cat <<EOL > .gitignore
node_modules/
pnpm-lock.yaml
package-lock.json
.env
EOL
fi

# Install Git if not already installed
if ! command_exists git; then
    echo "Installing Git..."
    sudo apt install -y git
else
    echo "Git is already installed."
fi

# Install Netlify CLI globally if not installed
if ! command_exists netlify; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
else
    echo "Netlify CLI is already installed."
fi

echo "All required tools for Financial Assistant are installed and ready to use!"
