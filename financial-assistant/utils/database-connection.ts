import mysql from "mysql2/promise"

/**
 * Database Connection Configuration
 *
 * This file sets up the connection to our MySQL database.
 * It uses environment variables for secure configuration.
 */

// Database connection configuration from environment variables
const databaseConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  port: Number.parseInt(process.env.MYSQL_PORT || "3306"),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "moneyminder",
  // Allow multiple statements in one query (useful for initialization)
  multipleStatements: true,
  // Configure connection pool for better performance
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create a connection pool (more efficient than single connections)
const pool = mysql.createPool(databaseConfig)

/**
 * Execute a SQL query with optional parameters
 *
 * @param sql - The SQL query to execute
 * @param params - Optional parameters for the query (prevents SQL injection)
 * @returns The query results
 */
export async function executeQuery(sql: string, params: any[] = []) {
  try {
    // Get a connection from the pool and execute the query
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

/**
 * Initialize the database tables
 * Creates all required tables if they don't exist
 */
export async function initializeDatabase() {
  try {
    // Create users table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        bio TEXT,
        email_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(100),
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        two_factor_secret VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Create transactions table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        date DATE NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Create savings_goals table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS savings_goals (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        target DECIMAL(10, 2) NOT NULL,
        current DECIMAL(10, 2) DEFAULT 0,
        deadline DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Create financial_summaries table for caching calculated values
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS financial_summaries (
        user_id VARCHAR(36) PRIMARY KEY,
        income DECIMAL(10, 2) DEFAULT 0,
        expenses DECIMAL(10, 2) DEFAULT 0,
        balance DECIMAL(10, 2) DEFAULT 0,
        savings_rate DECIMAL(5, 2) DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Database initialization error:", error)
    throw error
  }
}

/**
 * Test the database connection
 * Useful for checking if the database is accessible
 */
export async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection()
    connection.release()
    return { connected: true, message: "Successfully connected to the database" }
  } catch (error: any) {
    return { connected: false, message: error.message }
  }
}

