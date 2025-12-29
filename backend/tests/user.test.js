const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('../routes/userRoutes');

// Load env variables
dotenv.config();

// Fallback secret agar env load na ho
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret123';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

// --- FIX IS HERE ---
// Database Connection (Timeout increased to 30 seconds)
beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('FATAL ERROR: MONGO_URI is not defined in .env');
  }
  try {
      await mongoose.connect(mongoUri);
  } catch (err) {
      console.error("DB Connection Failed in Test:", err);
  }
}, 30000); // <--- Ye 30000 add kiya hai (30 Seconds wait karega)

// Clean up after tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('User API Endpoints', () => {
  let userToken;
  // Unique email har baar
  const testEmail = `test${Date.now()}@example.com`; 

  // TEST 1: Register
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        fullName: 'Test User',
        email: testEmail,
        password: 'password123',
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  }, 30000); // Test ka timeout bhi badhaya

  // TEST 2: Login
  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testEmail,
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    userToken = res.body.token; 
  }, 30000);

  // TEST 3: Invalid Login
  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testEmail,
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(401);
  }, 30000);

  // TEST 4: Profile
  it('should access protected profile with token', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('email', testEmail);
  }, 30000);

  // TEST 5: No Token Fail
  it('should fail to access profile without token', async () => {
    const res = await request(app)
      .get('/api/users/profile');

    expect(res.statusCode).toEqual(401);
  }, 30000);
});