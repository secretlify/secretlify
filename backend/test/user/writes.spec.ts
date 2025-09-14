import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from '../utils/bootstrap';

describe('User writes (e2e)', () => {
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

  describe('PATCH /users/me', () => {
    it('updates own keys', async () => {
      // given
      const { user, token } = await bootstrap.utils.userUtils.createDefault({
        email: 'test@test.com',
      });

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .patch(`/users/me`)
        .set('authorization', `Bearer ${token}`)
        .send({ publicKey: 'test-public-key', privateKeyEncrypted: 'test-private-key' });

      // then
      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject({
        publicKey: 'test-public-key',
        privateKeyEncrypted: 'test-private-key',
      });
    });

    it('does not update if not logged in', async () => {
      // when
      const response = await request(bootstrap.app.getHttpServer())
        .patch(`/users/me`)
        .send({ publicKey: 'test-public-key', privateKeyEncrypted: 'test-private-key' });

      // then
      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });
});
