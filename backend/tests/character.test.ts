import request from 'supertest';
import app from '../src/index';

const archetype = {
  id: 'knight',
  name: 'Knight',
  description: 'A brave warrior',
  avatarUrl: 'placeholder',
  stats: { hp: 10, attack: 5, defense: 5 },
};

describe('character persistence', () => {
  it('saves character and retrieves it after re-login', async () => {
    await request(app)
      .post('/api/signup')
      .send({ email: 'c@d.com', password: 'pass' })
      .expect(200);
    let res = await request(app)
      .post('/api/login')
      .send({ email: 'c@d.com', password: 'pass' })
      .expect(200);
    const token1 = res.body.token as string;
    await request(app)
      .post('/api/character')
      .set('Authorization', 'Bearer ' + token1)
      .send({ archetype })
      .expect(200);
    res = await request(app)
      .post('/api/login')
      .send({ email: 'c@d.com', password: 'pass' })
      .expect(200);
    const token2 = res.body.token as string;
    const charRes = await request(app)
      .get('/api/character')
      .set('Authorization', 'Bearer ' + token2)
      .expect(200);
    expect(charRes.body.name).toBe('Knight');
  });
});
