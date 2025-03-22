# Financial Assistant

This is a Next.js application that provides a simple financial assistant. The application provides a dashboard with an overview of your financial situation, as well as a list of recent transactions. You can also add new transactions and view detailed information about each transaction.

## Features

- **Dashboard**: Get an overview of your financial situation.
- **Transactions**: View a list of recent transactions.
- **Add Transactions**: Add new transactions to your account.
- **Detailed View**: View detailed information about each transaction.
- **Authentication**: Secure login and registration system.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Screenshots

### Landing Page
![Detailed View](blob:https://imgur.com/c2893553-3a7b-488a-831f-d8d7a6371b55)

### Login
![Add Transaction](https://i.imgur.com/fGGtaZG.png)

### Dashboard
![Dashboard](blob:https://imgur.com/12610e69-be6c-44ec-acde-bea23b272752)

### Transactions
![Transactions](blob:https://imgur.com/a44b94cb-67ec-4332-9b54-7bb1f905ef50)


## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation.
- **React**: JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Framer Motion**: Library for animations.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: ODM for MongoDB.
- **Express**: Web framework for Node.js.
- **TypeScript**: Typed superset of JavaScript.
- **JWT**: JSON Web Tokens for authentication.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **Radix UI**: Primitives for building accessible, high-quality design systems and web apps.
- **Jest**: JavaScript testing framework.
- **ESLint**: Pluggable linting utility for JavaScript and JSX.
- **Prettier**: Code formatter.
- **PostCSS**: Tool for transforming CSS with JavaScript plugins.
- **Autoprefixer**: PostCSS plugin to parse CSS and add vendor prefixes.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/financial-assistant.git
   cd financial-assistant
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file and configure the required environment variables:
   ```
   DATABASE_URL=mongodb+srv://your-database-url
   JWT_SECRET=your-secret-key
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Run the application**:
   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

## Running Tests

To run tests, execute:
   ```bash
   npm run test
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
