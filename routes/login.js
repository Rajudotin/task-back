const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const db = require('../db');

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const [results] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful', userId: user.id });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ message: 'Error during login' });
  }
});

module.exports = router;
