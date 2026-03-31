import request from 'supertest';
import { createApp } from '../../src/app';
import { pool } from '../../src/config/db';

const app = createApp();

describe('Auth Endpoints', () => {
  let accessToken: string;
  let refreshToken: string;
  const testEmail = `test-${Date.now()}@example.com`;

  afterAll(async () => {
    // Cleanup test user
    await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
    await pool.end();
  });

  describe('POST /api/v1/auth/register', () => {
    it('registers first user as Admin and returns tokens', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ full_name: 'Test Admin', email: testEmail, password: 'TestPass@123' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('access_token');
      expect(res.body.data).toHaveProperty('refresh_token');
      expect(res.body.data.user.email).toBe(testEmail);

      accessToken = res.body.data.access_token;
      refreshToken = res.body.data.refresh_token;
    });

    it('returns 409 for duplicate email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ full_name: 'Another User', email: testEmail, password: 'TestPass@123' });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('CONFLICT');
    });

    it('returns 400 for weak password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ full_name: 'Weak User', email: 'weak@test.com', password: 'abc' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ full_name: 'Bad Email', email: 'notanemail', password: 'TestPass@123' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('logs in with correct credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testEmail, password: 'TestPass@123' });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('access_token');
      accessToken = res.body.data.access_token;
      refreshToken = res.body.data.refresh_token;
    });

    it('returns 401 for wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testEmail, password: 'WrongPass@123' });

      expect(res.status).toBe(401);
    });

    it('returns 401 for non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'nobody@test.com', password: 'TestPass@123' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('returns current user with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(testEmail);
    });

    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });

    it('returns 401 with malformed token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer not.a.valid.token');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('returns new tokens with valid refresh token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refresh_token: refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('access_token');
      expect(res.body.data).toHaveProperty('refresh_token');
      // Store for logout test
      refreshToken = res.body.data.refresh_token;
    });

    it('returns 401 with invalid refresh token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refresh_token: 'invalid-token-xyz' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('logs out and revokes refresh token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refresh_token: refreshToken });

      expect(res.status).toBe(200);
    });

    it('revoked refresh token can no longer be used', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refresh_token: refreshToken });

      expect(res.status).toBe(401);
    });
  });

  describe('Health check', () => {
    it('GET /health returns 200', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
