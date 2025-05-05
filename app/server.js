const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Gemini API Key
const GEMINI_API_KEY = 'AIzaSyCYRVJDzwkKee0YhKfVeUgAVi7It7UvQa4'; // DEMO
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// Load DB
const dbPath = './db.json';
let users = [];
try {
  if (fs.existsSync(dbPath)) {
    users = JSON.parse(fs.readFileSync(dbPath));
  }
} catch (error) {
  console.error('Failed to read DB file:', error);
  users = [];
}

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });
  }

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));

  res.json({ message: 'User registered successfully.' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  res.json({ message: 'Login successful.' });
});

// Chat
app.post('/api/chat', async (req, res) => {
  const { username, message, mode } = req.body;

  if (!users.find(u => u.username === username)) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  let systemPrompt = 'You are a helpful programming tutor.';
  if (mode === 'wrong-code') {
    systemPrompt = 'Provide buggy code and explain issues.';
  }
  if (mode === 'correct-code') {
    systemPrompt = 'Provide correct code and explain it.';
  }
  if (mode === 'multiple-choice') {
    systemPrompt =
      'Ask programming multiple-choice questions and explain answers.';
  }

  const prompt = {
    contents: [
      { role: 'system', parts: [{ text: systemPrompt }] },
      { role: 'user', parts: [{ text: message }] }
    ]
  };

  try {
    const geminiRes = await axios.post(GEMINI_URL, prompt);
    const botResponse =
      geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No response generated.';
    res.json({ response: botResponse });
  } catch (err) {
    console.error('Gemini API error:', err.response?.data || err.message);
    res
      .status(500)
      .json({ message: 'Error connecting to AI.', error: err.message });
  }
});

// Catch-all route (fix for Express 5.x wildcard issue)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
