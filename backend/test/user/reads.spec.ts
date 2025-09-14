import * as request from 'supertest';
import { createTestApp } from '../utils/bootstrap';

describe('UserCoreController (reads)', () => {
  let bootstrap: Awaited<ReturnType<typeof createTestApp>>;

  beforeAll(async () => {
    bootstrap = await createTestApp();
  });

  beforeEach(async () => {
    await bootstrap.methods.beforeEach();
  });

  afterAll(async () => {
    await bootstrap.methods.afterAll();
  });

  describe('GET /users/me', () => {
    it('returns current user', async () => {
      // given
      const { user, token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .get('/users/me')
        .set('authorization', `Bearer ${token}`);

      // then
      expect(response.body).toMatchObject({ id: expect.any(String), email: user.email });
    });

    it('returns 401 when not logged in', async () => {
      // when
      const response = await request(bootstrap.app.getHttpServer()).get('/users/me');

      // then
      expect(response.status).toEqual(401);
    });
  });

  describe('POST /users/public-keys', () => {
    it('returns public keys', async () => {
      // given
      const { user: user1, token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });
      const { user: user2 } = await bootstrap.utils.userUtils.createDefault({
        email: 'test2@test.com',
      });

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .post('/users/public-keys')
        .send({
          userIds: [user1.id, user2.id],
        })
        .set('authorization', `Bearer ${token}`);

      // then
      expect(response.body.publicKeys).toEqual({
        [user1.id]: user1.publicKey,
        [user2.id]: user2.publicKey,
      });
    });

    it('returns 401 when not logged in', async () => {
      // when
      const response = await request(bootstrap.app.getHttpServer()).post('/users/public-keys');

      // then
      expect(response.status).toEqual(401);
    });
  });
});
