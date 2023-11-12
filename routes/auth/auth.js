const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const connection = require('../../config/db'); 

const secretKey = 'kunciRahasiaYangSama'; 

router.post('/register', [
  body('username').notEmpty().withMessage('Isi semua bidang'), 
  body('password').notEmpty().withMessage('Isi semua bidang'), 
], (req, res) => {
  const errors = validationResult(req); 
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() }); 
  }
  const { username, password } = req.body;
  const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
  connection.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Server Error' });
    }
    if (results.length > 0) {
      return res.status(409).json({ error: 'Pengguna sudah terdaftar' });
    }
    const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
    connection.query(insertUserQuery, [username, password], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Server Error' });
      }
      const payload = { userId: results.insertId, username };
      const token = jwt.sign(payload, secretKey);
      const updateTokenQuery = 'UPDATE users SET token = ? WHERE id = ?';
      connection.query(updateTokenQuery, [token, results.insertId], (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Server Error' });
        }
        res.json({ token });
      });
    });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Server Error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Gagal masuk' });
    }
    const user = results[0];
    if (user.password !== password) {
      return res.status(401).json({ error: 'Kata sandi salah' });
    }
    if (user.token) {
      const token = user.token;
      res.json({ token });
    } else {
      const payload = { userId: user.id, username };
      const token = jwt.sign(payload, secretKey);
      const updateTokenQuery = 'UPDATE users SET token = ? WHERE id = ?';
      connection.query(updateTokenQuery, [token, user.id], (err, updateResult) => {
        if (err) {
          return res.status(500).json({ error: 'Server Error' });
        }
        res.json({ token });
      });
    }
  });
});

module.exports = router;