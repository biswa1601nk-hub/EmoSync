require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Configure MongoDB Database
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/emosync')
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Define User Schema & Model
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  stressLevel: { type: Number, default: 50 },
  criticalStatus: { type: Boolean, default: false },
  isLive: { type: Boolean, default: false }, // Tracks if user has hardware connected
  lastUpdated: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Helper to seed initial users if database is empty
const seedUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      await User.insertMany([
        { userId: '1', name: 'Alice Smith', email: 'alice@test.com', password: '123', stressLevel: 85, criticalStatus: true, isLive: false },
        { userId: '2', name: 'Bob Johnson', email: 'bob@test.com', password: '123', stressLevel: 40, criticalStatus: false, isLive: false },
        { userId: '3', name: 'Charlie Brown', email: 'charlie@test.com', password: '123', stressLevel: 55, criticalStatus: false, isLive: false },
      ]);
      console.log('Seeded database with initial users.');
    }
  } catch (err) {
    console.error('Error seeding DB', err);
  }
};
seedUsers();

// Helper to mathematically stagger timestamps for inactive users on boot for realism
const scrambleInactiveUsers = async () => {
    try {
        const users = await User.find({ isLive: false });
        for (let i = 0; i < users.length; i++) {
            const offsetMs = (Math.floor(Math.random() * 120) + 5) * 60000; // random offset between 5 and 125 mins
            users[i].lastUpdated = new Date(Date.now() - offsetMs);
            await users[i].save();
        }
        console.log('Staggered inactive user timestamps.');
    } catch (err) {}
};
scrambleInactiveUsers();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Real-time data push simulation
  const interval = setInterval(async () => {
    try {
      const updatedUsers = await User.find();
      const formattedData = updatedUsers.map(u => ({
        id: u.userId,
        name: u.name,
        stressLevel: u.stressLevel,
        criticalStatus: u.criticalStatus,
        lastUpdated: u.lastUpdated
      }));
      
      socket.emit('emotions-update', formattedData);
    } catch (err) {
      console.error('Error processing live updates:', err);
    }
  }, 500);

  // New endpoint to receive Bluetooth wearable data from frontend
  socket.on('wearable-update', async (clientData) => {
    try {
      if (!clientData || !clientData.userId) return;
      const user = await User.findOne({ userId: clientData.userId });
      if (user) {
        user.isLive = true; // Lock this user down so simulation engine stops touching it
        user.stressLevel = clientData.stressLevel;
        user.criticalStatus = clientData.stressLevel > 80;
        user.lastUpdated = new Date();
        await user.save();
      }
    } catch (err) {
      console.error('Wearable update error:', err);
    }
  });

  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log('Client disconnected:', socket.id);
  });
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser = new User({
      userId: new mongoose.Types.ObjectId().toString(),
      name,
      email,
      password, // In a real app, hash this!
      stressLevel: 50,
      criticalStatus: false
    });

    await newUser.save();
    console.log(`New user registered: ${name}`);
    res.json({ message: 'Registration successful', role: 'user' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete registration' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Check if admin
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    return res.json({ role: 'admin', message: 'Logged in as Admin', name: 'System Admin' });
  }
  
  // Check in DB for registered users
  const user = await User.findOne({ email, password });
  if (user) {
    return res.json({ role: 'user', message: 'Logged in successfully', name: user.name, userId: user.userId });
  }

  return res.status(401).json({ error: 'Invalid credentials. Please verify your email and password.' });
});

app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    });
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ error: 'Invalid Google token' });

    const { email, name, sub: googleId } = payload;
    
    // Store in DB for ALL users (including Admin)
    let user = await User.findOne({ email });
    if (!user) {
      // Create new user if not exists
      user = new User({
        userId: new mongoose.Types.ObjectId().toString(),
        name: name || 'Google User',
        email,
        password: googleId, // Use google id as placeholder password
        stressLevel: 50,
        criticalStatus: false
      });
      await user.save();
    }

    // Check if admin (after they are saved in DB)
    if (email === process.env.ADMIN_EMAIL) {
      return res.json({ role: 'admin', message: 'Logged in as Admin via Google', name: user.name, userId: user.userId });
    }

    res.json({ role: 'user', message: 'Logged in via Google successfully', name: user.name, userId: user.userId });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ error: 'Google login failed' });
  }
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
