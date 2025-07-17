import request from 'supertest';
import app from '../src/index';

describe('auth', () => {
  it('signs up and logs in a user', async () => {
    await request(app).post('/api/signup').send({ email: 'a@b.com', password: 'pass' }).expect(200);
    const res = await request(app).post('/api/login').send({ email: 'a@b.com', password: 'pass' }).expect(200);
    expect(res.body.token).toBeDefined();
  });
});
