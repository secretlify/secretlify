import { Module } from '@nestjs/common';

import { EncryptionService } from './encryption.service';

@Module({
  providers: [
    {
      provide: EncryptionService,
      useFactory: async () => {
        const encryptionService = new EncryptionService();
        await encryptionService.init();
        return encryptionService;
      },
    },
  ],
  exports: [EncryptionService],
})
export class EncryptionModule {}
