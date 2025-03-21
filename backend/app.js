// backend/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware Setup
app.use(cors());
app.use(express.json());

// Simple JWT authentication middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Sample route: Health Check
app.get('/', (req, res) => {
  res.send('Freelancer Platform API is running.');
});

// Protected Route Example: Milestone Creation
app.post('/api/milestones', authenticateJWT, (req, res) => {
  // Here you'd handle the logic to create a milestone and integrate with the escrow system.
  res.json({ message: 'Milestone created successfully', data: req.body });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
