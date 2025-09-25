export const githubExternalConnectionClientMock = {
  getRepositoriesAvailableForInstallation: jest.fn(),
  getInstallationByGithubInstallationId: jest.fn(),
  deleteInstallation: jest.fn(),
  getRepositoryInfoByInstallationIdAndRepositoryId: jest.fn(),
  getInstallationAccessToken: jest.fn(),
  getRepositoryPublicKey: jest.fn(),
};
