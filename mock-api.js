// mock-api.js - A simple Express server to handle API requests
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Mock user data
const mockUsers = [
  { id: 1, email: 'student@example.com', password: 'password', name: 'Test Student', user_type: 'student' },
  { id: 2, email: 'lawyer@example.com', password: 'password', name: 'Test Lawyer', user_type: 'lawyer', specialty: 'IP Law' }
];

// Auth routes
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  
  // Return success with user info (except password)
  const { password: _, ...userWithoutPassword } = user;
  
  // Create a JWT-like token structure with user information
  const tokenPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.user_type,
    usertype: user.user_type,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours expiration
  };
  
  // Create a Base64 encoded token similar to JWT format
  const tokenHeader = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const tokenBody = btoa(JSON.stringify(tokenPayload));
  const tokenSignature = btoa('mocksignature');
  const token = `${tokenHeader}.${tokenBody}.${tokenSignature}`;
  
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    user: userWithoutPassword,
    token: token
  });
});

app.post('/auth/registerUser', (req, res) => {
  const { email, name, password } = req.body;
  
  // Check if user already exists
  if (mockUsers.some(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  
  // Create new user
  const newUser = {
    id: mockUsers.length + 1,
    email,
    password,
    name,
    user_type: 'user'
  };
  
  mockUsers.push(newUser);
  
  // Return success with user info (except password)
  const { password: _, ...userWithoutPassword } = newUser;
  
  return res.status(201).json({
    success: true,
    message: 'Registration successful',
    user: userWithoutPassword
  });
});

app.post('/auth/registerLawyer', (req, res) => {
  const { email, name, password, phone, licenseNumber, specialty } = req.body;
  
  // Check if user already exists
  if (mockUsers.some(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  
  // Create new lawyer
  const newLawyer = {
    id: mockUsers.length + 1,
    email,
    password,
    name,
    phone,
    licenseNumber,
    specialty,
    user_type: 'lawyer'
  };
  
  mockUsers.push(newLawyer);
  
  // Return success with user info (except password)
  const { password: _, ...userWithoutPassword } = newLawyer;
  
  return res.status(201).json({
    success: true,
    message: 'Registration successful',
    user: userWithoutPassword
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
});

// Add a catch-all route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route not found: ${req.method} ${req.originalUrl}` 
  });
});

// Add cases endpoint
app.get('/api/cases', (req, res) => {
  res.json([
    { id: 1, title: 'Trademark Infringement Case', status: 'Active' },
    { id: 2, title: 'Copyright Dispute', status: 'Closed' },
    { id: 3, title: 'Patent Application Review', status: 'Pending' }
  ]);
});

// Serve the AuthPage.tsx file (this is to fix the error you're seeing)
app.get('/api/cases/AuthPage.tsx', (req, res) => {
  // Send a mock response instead of the actual file
  res.json({ message: 'This endpoint now returns valid JSON instead of trying to serve a .tsx file' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
});
