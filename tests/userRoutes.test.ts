import request from 'supertest';
import app from '../src/app';  // Import your Express app
import { beforeAll, afterAll, describe, expect, it } from '@jest/globals';

import mongoose from 'mongoose';
import User from '../src/models/User';

describe('User Routes', () => {
    let server: any;
  beforeAll(async () => {
    server = app.listen(3000);
    // Wait for MongoDB to connect
   // await mongoose.connect('mongodb://localhost:27017/test_db');
  });

  afterAll(async () => {
    // Clean up database after tests
    server.close();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await new Promise<void>(resolve => setTimeout(() => resolve(), 10000));
  });

  // Test user registration
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.token).toBeDefined();
  });

  // Test user login
  it('should log in an existing user and return a token', async () => {
    // Register the user first
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    // Then log the user in
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBeDefined();
  });

  // Test protected route
  it('should access a protected route with a valid token', async () => {
    // Register and log in the user to get the token
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    const token = loginResponse.body.token;

    // Now access the protected route with the token
    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('test@example.com');
  });

  // Test protected route without a token
  it('should not access a protected route without a token', async () => {
    const response = await request(app).get('/api/users/profile');
    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Access denied. No token provided.');
  });

  // Test login with incorrect credentials
  it('should return error for invalid login', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid credentials');
  });
});
