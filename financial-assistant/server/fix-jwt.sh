#!/bin/bash
# Script to fix JWT package issues

# Remove existing jsonwebtoken and its types
npm uninstall jsonwebtoken @types/jsonwebtoken

# Install the latest versions
npm install jsonwebtoken@9.0.2
npm install --save-dev @types/jsonwebtoken@9.0.4

echo "JWT packages reinstalled successfully!"

