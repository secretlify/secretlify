import { Injectable } from '@nestjs/common';
import * as sodium from 'libsodium-wrappers';

// todo: probably can be removed  moved to frontend because secrets are already encrypted
@Injectable()
export class EncryptionService {
  private sodium: typeof sodium;

  public async init(): Promise<void> {
    await sodium.ready;
    this.sodium = sodium;
  }

  public encrypt(str: string, publicKey: string): string {
    const variant = sodium.base64_variants.ORIGINAL; // todo: consider URLSAFE_NO_PADDING
    const messageBytes = sodium.from_string(str);
    const keyBytes = sodium.from_base64(publicKey, variant);

    const encryptedBytes = sodium.crypto_box_seal(messageBytes, keyBytes);

    return sodium.to_base64(encryptedBytes, variant);
  }
}
