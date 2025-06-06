const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/users.js');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware (session ends when tab/browser closes)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: null
  }
}));

// Set view engine and views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MongoDB Atlas connection
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Middleware to protect routes
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/signup'); // Or redirect to login page
  }
  next();
}

// Routes
app.get('/', (req, res) => {
  res.render("fr01.ejs");
});

app.get('/signup', (req, res) => {
  res.render("sigup.ejs");
});
app.get('/forgot-password', (req, res) => {
  res.render("forgot-password.ejs");
});

app.get('/dashboard', requireLogin, (req, res) => {
  res.render("dash.ejs");
});
app.get('/analyze-interview', requireLogin, (req, res) => {
  res.render("inter.ejs");
});

// Register route
app.post('/register', async (req, res) => {
  const { email, password, securityQuestion, securityAnswer } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      email, 
      password: hashedPassword,
      securityQuestion,
      securityAnswer
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).render('fr01.ejs', { error: 'Invalid email or password'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).render('fr01.ejs', { error: 'Invalid email or password'});
    }

    // Set session
    req.session.userId = user._id;
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// ✅ Logout route (Session Destroy)
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    res.redirect('/'); // Redirect to homepage or login page
  });
});








// Verify security answer
app.post('/verify-security-answer', async (req, res) => {
  const { email, securityQuestion, securityAnswer } = req.body;

  try {
    const user = await User.findOne({ email, securityQuestion });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found or security question mismatch' });
    }

    if (user.securityAnswer !== securityAnswer) {
      return res.status(401).json({ message: 'Incorrect security answer' });
    }

    res.status(200).json({ message: 'Verification successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Reset password
app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});




// mock interview



const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API endpoint to analyze interview responses
app.post('/analyze-interview', async (req, res) => {
  try {
    const { questions, answers, field } = req.body;
    
    // Combine questions and answers into a single prompt
    let prompt = `Analyze this mock interview for a ${field} position. Provide:\n`;
    prompt += `1. A score out of 100 based on answer quality\n`;
    prompt += `2. Detailed feedback on each answer\n`;
    prompt += `3. Overall strengths and weaknesses\n\n`;
    
    for (let i = 0; i < questions.length; i++) {
      prompt += `Question ${i+1}: ${questions[i]}\n`;
      prompt += `Answer: ${answers[i]}\n\n`;
    }
    
    prompt += `Please provide comprehensive analysis in markdown format.`;
    
    // Get the Gemini Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Updated to 1.5-flash
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ analysis: text });
  } catch (error) {
    console.error('Error analyzing interview:', error);
    res.status(500).json({ 
      error: 'Failed to analyze interview',
      details: error.message,
      suggestion: 'Please ensure you are using the correct model name and your API key is valid'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
