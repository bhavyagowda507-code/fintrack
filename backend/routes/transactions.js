const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const transactions = [];

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all
router.get('/', auth, (req, res) => {
  const userTx = transactions.filter(t => t.userId === req.user.id);
  res.json(userTx);
});

// Add transaction
router.post('/', auth, (req, res) => {
  const tx = { id: Date.now(), userId: req.user.id, ...req.body };
  transactions.push(tx);
  res.json(tx);
});

// Delete
router.delete('/:id', auth, (req, res) => {
  const index = transactions.findIndex(t => t.id === parseInt(req.params.id));
  transactions.splice(index, 1);
  res.json({ message: 'Deleted' });
});

module.exports = router;