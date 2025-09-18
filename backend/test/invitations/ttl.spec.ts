import { advanceBy } from 'jest-date-mock';
import * as request from 'supertest';
import { InvitationTtlService } from '../../src/invitation/ttl/invitation-ttl.service';
import { createTestApp } from '../utils/bootstrap';

describe('InvitationCoreController (ttl)', () => {
  let bootstrap: Awaited<ReturnType<typeof createTestApp>>;
  let invitationTtlService: InvitationTtlService;

  beforeAll(async () => {
    bootstrap = await createTestApp();
    invitationTtlService = bootstrap.app.get(InvitationTtlService);
  });

  beforeEach(async () => {
    await bootstrap.methods.beforeEach();
  });

  afterAll(async () => {
    await bootstrap.methods.afterAll();
  });

  describe('Cron job', () => {
    it('automatically removes expired invitations', async () => {
      // given
      const { token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);

      // Create an invitation that will expire
      const invitation = await bootstrap.utils.invitationUtils.createInvitation(
        ownerToken,
        project.id,
      );

      // Advance time by 24 hours and 1 minute
      advanceBy(24 * 60 * 60 * 1000 + 60 * 1000);

      // Trigger the cron job manually (we don't want to wait for the actual cron schedule)
      await invitationTtlService.removeExpiredInvitations();

      // Try to get the invitation (should fail as it's been removed)
      const response = await request(bootstrap.app.getHttpServer())
        .get(`/invitations/${invitation.id}`)
        .set('authorization', `Bearer ${ownerToken}`);

      // then
      expect(response.status).toEqual(404);
    });

    it('does not remove non-expired invitations', async () => {
      // given
      const { token: ownerToken } = await bootstrap.utils.userUtils.createDefault({
        email: 'owner@test.com',
      });
      const project = await bootstrap.utils.projectUtils.createProject(ownerToken);

      // Create an invitation that will not expire
      const invitation = await bootstrap.utils.invitationUtils.createInvitation(
        ownerToken,
        project.id,
      );

      // Advance time by 23 hours
      advanceBy(23 * 60 * 60 * 1000);

      // Trigger the cron job manually
      await invitationTtlService.removeExpiredInvitations();

      // Try to get the invitation (should succeed as it's not expired)
      const response = await request(bootstrap.app.getHttpServer())
        .get(`/invitations/${invitation.id}`)
        .set('authorization', `Bearer ${ownerToken}`);

      // then
      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(invitation.id);
    });
  });
});
