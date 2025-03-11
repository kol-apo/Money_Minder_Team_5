// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yourpassword', // Replace with your MySQL password
  database: 'money_minder'  // Replace with your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ======================
// 1. User Authentication
// ======================

// Register a new user
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  // Encrypt password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const sql = 'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});

// Login user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM Users WHERE email = ?';
  db.query(sql, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result[0];

    // Compare passwords
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.user_id }, 'your-secret-key', { expiresIn: '1h' });
    res.status(200).json({ token });
  });
});

// ======================
// 2. Transaction Management
// ======================

// Add a transaction
app.post('/api/transactions', (req, res) => {
  const { user_id, amount, category } = req.body;

  // Encrypt transaction amount
  const cipher = crypto.createCipher('aes-256-cbc', 'your-encryption-key');
  let encryptedAmount = cipher.update(amount.toString(), 'utf8', 'hex');
  encryptedAmount += cipher.final('hex');

  const sql = 'INSERT INTO Transactions (user_id, amount, category) VALUES (?, ?, ?)';
  db.query(sql, [user_id, encryptedAmount, category], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Transaction added successfully' });
  });
});

// Get all transactions for a user
app.get('/api/transactions/:user_id', (req, res) => {
  const { user_id } = req.params;

  const sql = 'SELECT * FROM Transactions WHERE user_id = ?';
  db.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Decrypt transaction amounts
    const transactions = result.map(transaction => {
      const decipher = crypto.createDecipher('aes-256-cbc', 'your-encryption-key');
      let decryptedAmount = decipher.update(transaction.amount, 'hex', 'utf8');
      decryptedAmount += decipher.final('utf8');
      return { ...transaction, amount: decryptedAmount };
    });

    res.status(200).json(transactions);
  });
});

// ======================
// 3. Goal Tracking
// ======================

// Set a financial goal
app.post('/api/goals', (req, res) => {
  const { user_id, target_amount, deadline } = req.body;

  const sql = 'INSERT INTO Goals (user_id, target_amount, deadline) VALUES (?, ?, ?)';
  db.query(sql, [user_id, target_amount, deadline], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Goal set successfully' });
  });
});

// Get all goals for a user
app.get('/api/goals/:user_id', (req, res) => {
  const { user_id } = req.params;

  const sql = 'SELECT * FROM Goals WHERE user_id = ?';
  db.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(result);
  });
});

// ======================
// 4. Middleware for JWT Authentication
// ======================

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = decoded.id;
    next();
  });
};

// Example of a protected route
app.get('/api/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'This is a protected route' });
});