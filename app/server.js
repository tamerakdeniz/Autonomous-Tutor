const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

// Gemini API Key
const GEMINI_API_KEY = 'AIzaSyCYRVJDzwkKee0YhKfVeUgAVi7It7UvQa4';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors());
app.use(bodyParser.json());

// Serve frontend files
app.use(express.static(__dirname + '/frontend'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/frontend/index.html');
});

// Load or initialize users DB
let users = [];
if (fs.existsSync('./db.json')) {
  try {
    users = JSON.parse(fs.readFileSync('./db.json'));
  } catch {
    users = [];
  }
}

// Register route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  fs.writeFileSync('./db.json', JSON.stringify(users));
  res.json({ message: 'User registered successfully.' });
});

// Login route
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

// Chat route
app.post('/api/chat', async (req, res) => {
  const { username, message } = req.body;

  if (!users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Unauthorized.' });
  }

  const prompt = {
    contents: [{ role: 'user', parts: [{ text: message }] }]
  };

  try {
    const geminiRes = await axios.post(GEMINI_URL, prompt);
    const botResponse = geminiRes.data.candidates[0].content.parts[0].text;
    res.json({ response: botResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gemini API error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
