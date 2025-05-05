import axios from 'axios';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Gemini API Key
const GEMINI_API_KEY = 'AIzaSyCYRVJDzwkKee0YhKfVeUgAVi7It7UvQa4';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend')));

const dbPath = './db.json';
let users = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: 'Username and password required.' });

  if (users.find(u => u.username === username))
    return res.status(400).json({ message: 'Username already exists.' });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));

  res.json({ message: 'User registered successfully.' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: 'Invalid credentials.' });

  res.json({ message: 'Login successful.' });
});

app.post('/api/chat', async (req, res) => {
  const { username, message, mode, language } = req.body;

  if (!users.find(u => u.username === username))
    return res.status(401).json({ message: 'Unauthorized.' });

  let userPrompt = '';
  if (mode === 'wrong-code') {
    if (
      message.includes('found') ||
      message.toLowerCase().includes('bug') ||
      message.toLowerCase().includes('error')
    ) {
      userPrompt = `Please provide concise feedback on this ${language} code analysis: ${message}. Keep the response focused and brief.`;
    } else {
      userPrompt = `Provide a ${language} code snippet with bugs and ask to find the issues. Keep the explanation brief and focused. ${message}`;
    }
  } else if (mode === 'correct-code') {
    if (
      message.toLowerCase().includes('because') ||
      message.toLowerCase().includes('reason')
    ) {
      userPrompt = `Provide brief, focused feedback on this ${language} code explanation: ${message}. Keep the response concise.`;
    } else {
      userPrompt = `Provide a correct ${language} code example and briefly explain why it follows best practices. ${message}`;
    }
  } else {
    userPrompt = message;
  }

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
    });

    const botResponse =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No response generated.';
    res.json({ response: botResponse });
  } catch (err) {
    console.error('AI API Error:', err.message);
    res.status(500).json({
      message: 'Error connecting to AI.',
      error: err.message
    });
  }
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
