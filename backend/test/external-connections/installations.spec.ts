import * as request from 'supertest';
import { createTestApp } from '../utils/bootstrap';

describe('HealthController (reads)', () => {
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

  describe('GET /health', () => {
    it('returns 200', async () => {
      // when
      const response = await request(bootstrap.app.getHttpServer()).get('/health');

      // then
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
