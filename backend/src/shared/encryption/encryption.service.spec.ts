import { EncryptionService } from 'src/shared/encryption/encryption.service';

describe(EncryptionService.name, () => {
  let service: EncryptionService;

  beforeAll(async () => {
    service = new EncryptionService();
    await service.init();
  });

  describe('encrypt', () => {
    const publicKey = 'rj1NEoKQb3cDmkXJ0hjvZ3RGgV9sBdZuTnLqX5XyIhA=';

    it('encrypts the given string', () => {
      const str = 'hello';
      const encrypted = service.encrypt(str, publicKey);
      expect(encrypted).not.toEqual(str);
    });
  });
});
