# Create setup.sh file
#!/bin/bash

echo "Installing server dependencies..."
cd server
npm install
npm install --save-dev typescript ts-node nodemon @types/express @types/cors @types/node @types/jsonwebtoken @types/bcryptjs

echo "Installing frontend dependencies..."
cd ..
npm install
npm install --save-dev typescript @types/react @types/react-dom @types/node @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom eslint eslint-config-next eslint-config-prettier eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier autoprefixer postcss tailwindcss

echo "Setup complete!"' > setup.sh

# Make it executable
chmod +x setup.sh

# Run it
./setup.sh