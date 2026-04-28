const express = require('express');
const path = require('path');

const app = express();
const PORT = 4000;

// Serve static files
app.use(express.static(__dirname));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:page', (req, res) => {
    const page = req.params.page;
    if (page.endsWith('.html')) {
        res.sendFile(path.join(__dirname, page));
    } else {
        res.status(404).send('Not Found');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
  name: String,
  email: String,
  password: String,
  phone: String,
  address: String,
  accountType: String,
  accountNumber: { type: String, unique: true },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Generate unique account number
function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

// API routes
app.get('/api/test', async (req, res) => {
  try {
    // Create a test user
    const testUser = {
      name: "Test User",
      email: "test@example.com",
      password: "Test1234",
      phone: "9876543210",
      address: "123 Test Street",
      accountType: "savings",
      balance: 1000
    };

    // Find existing test user and remove it
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      await User.deleteOne({ _id: existingUser._id });
    }

    // Create new test user
    const newUser = new User(testUser);
    await newUser.save();

    // Get all users to show the data
    const users = await User.find();
    res.json({
      message: "Test user created successfully",
      data: users
    });
  } catch (err) {
    console.error('Error creating test user:', err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message
    });
  }
});

// Serve HTML files directly
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

// Serve other HTML files
app.get('/:page', (req, res) => {
  const page = req.params.page;
  if (page.endsWith('.html')) {
    res.sendFile(page, { root: __dirname });
  } else {
    res.status(404).send('Not Found');
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, phone, address, accountType, balance } = req.body;
    
    if (!name || !email || !password || !phone || !address || !accountType || typeof balance !== 'number') {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Generate account number
    let accountNumber;
    do {
      accountNumber = generateAccountNumber();
    } while (await User.findOne({ accountNumber }));

    const newUser = new User({
      name,
      email,
      password,
      phone,
      address,
      accountType,
      accountNumber,
      balance
    });

    await newUser.save();
    
    // Don't send password in response
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: userResponse
    });
  } catch (err) {
    console.error('Error creating user:', err);
    if (err.code === 11000) { // Duplicate key error
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ 
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.get('/api/users/:accountNumber', async (req, res) => {
  try {
    const user = await User.findOne({ accountNumber: req.params.accountNumber });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't send password in response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Error handling middleware


// Server listening
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 