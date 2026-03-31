import request from 'supertest';
import { createApp } from '../../src/app';
import { pool } from '../../src/config/db';

const app = createApp();

describe('Tasks Endpoints', () => {
  let adminToken: string;
  let memberToken: string;
  let taskId: string;
  const adminEmail = `admin-tasks-${Date.now()}@example.com`;
  const memberEmail = `member-tasks-${Date.now()}@example.com`;

  beforeAll(async () => {
    // Register admin (first user)
    const adminRes = await request(app)
      .post('/api/v1/auth/register')
      .send({ full_name: 'Admin User', email: adminEmail, password: 'TestPass@123' });
    adminToken = adminRes.body.data.access_token;

    // Register member
    const memberRes = await request(app)
      .post('/api/v1/auth/register')
      .send({ full_name: 'Member User', email: memberEmail, password: 'TestPass@123' });
    memberToken = memberRes.body.data.access_token;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email IN ($1, $2)', [adminEmail, memberEmail]);
    await pool.end();
  });

  describe('POST /api/v1/tasks', () => {
    it('Admin can create a task', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'First Task', priority: 'High' });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('First Task');
      expect(res.body.data.status).toBe('Todo');
      taskId = res.body.data.id;
    });

    it('Member cannot create a task', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${memberToken}`)
        .send({ title: 'Member Task', priority: 'Low' });

      expect(res.status).toBe(403);
    });

    it('returns 400 for missing title', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ priority: 'Low' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'No Auth Task' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/tasks', () => {
    it('Admin sees all tasks', async () => {
      const res = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toBeDefined();
    });

    it('supports status filter', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?status=Todo')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      res.body.data.forEach((t: { status: string }) => {
        expect(t.status).toBe('Todo');
      });
    });

    it('supports priority filter', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?priority=High')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    it('returns task detail with comments and activity', async () => {
      const res = await request(app)
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(taskId);
      expect(Array.isArray(res.body.data.comments)).toBe(true);
      expect(Array.isArray(res.body.data.activity)).toBe(true);
    });

    it('returns 404 for invalid ID', async () => {
      const res = await request(app)
        .get('/api/v1/tasks/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/v1/tasks/:id/status', () => {
    it('can transition Todo → InProgress', async () => {
      const res = await request(app)
        .patch(`/api/v1/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'InProgress' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('InProgress');
    });

    it('rejects invalid transition InProgress → Done (skipping InReview)', async () => {
      const res = await request(app)
        .patch(`/api/v1/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Done' });

      expect(res.status).toBe(400);
    });

    it('allows valid transition InProgress → InReview', async () => {
      const res = await request(app)
        .patch(`/api/v1/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'InReview' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('InReview');
    });

    it('allows InReview → Done', async () => {
      const res = await request(app)
        .patch(`/api/v1/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Done' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('Done');
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('Admin can soft-delete a task', async () => {
      const res = await request(app)
        .delete(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(204);
    });

    it('deleted task returns 404', async () => {
      const res = await request(app)
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });
});
