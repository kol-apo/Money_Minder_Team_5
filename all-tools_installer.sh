#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Update package list
echo "Updating package list..."
sudo apt update -y && sudo apt upgrade -y

# Install Node.js and npm if not already installed
if ! command_exists node; then
    echo "Node.js is not installed. Installing Node.js and npm..."
    sudo apt install -y nodejs npm
else
    echo "Node.js is already installed."
fi

# Install Python 3 and pip if not already installed
if ! command_exists python3; then
    echo "Python 3 is not installed. Installing Python 3 and pip..."
    sudo apt install -y python3 python3-pip
else
    echo "Python 3 is already installed."
fi

# Install MySQL if not already installed
if ! command_exists mysql; then
    echo "MySQL is not installed. Installing MySQL..."
    sudo apt install -y mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
    sudo mysql_secure_installation
else
    echo "MySQL is already installed."
fi

# Create Money Minder database
echo "Setting up MySQL database..."
sudo mysql -u root -e "CREATE DATABASE IF NOT EXISTS money_minder;"

# Install Backend Dependencies
echo "🛠 Installing backend dependencies..."
cd Backend
npm install

# Create .env file for backend
if ! command_exists git; then
    echo "Creating backend .env file..."
    cat <<EOL > .env
DB_HOST=localhost
DB_USER=root
DB_PASS=MONEY5
DB_NAME=money_minder
JWT_SECRET=MINDER5
EOL
fi
cd ..

# Install Frontend Dependencies
echo "Installing frontend dependencies..."
cd Front-End
npm install

# Create .env file for frontend
if ! command_exists git; then
    echo "Creating frontend .env file..."
    cat <<EOL > .env
REACT_APP_API_URL=http://localhost:5000
EOL
fi
cd ..

# Install Git if not already installed
if ! command_exists git; then
    echo "Git is not installed. Installing Git..."
    sudo apt install -y git
else
    echo "Git is already installed."
fi

# Install React.js (create-react-app) globally if not already installed
if ! command_exists create-react-app; then
    echo "React.js (create-react-app) is not installed. Installing create-react-app globally..."
    sudo npm install -g create-react-app
else
    echo "React.js (create-react-app) is already installed."
fi

# Install Netlify CLI globally if not already installed
if ! command_exists netlify; then
    echo "Netlify CLI is not installed. Installing Netlify CLI globally..."
    sudo npm install -g netlify-cli
else
    echo "Netlify CLI is already installed."
fi

echo "All required tools are installed and ready to use!"