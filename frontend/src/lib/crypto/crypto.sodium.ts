import sodium from "libsodium-wrappers";

await sodium.ready;

export class SodiumCrypto {
  public static encrypt(str: string, publicKey: string): string {
    const variant = sodium.base64_variants.ORIGINAL; // todo: consider URLSAFE_NO_PADDING
    const messageBytes = sodium.from_string(str);
    const keyBytes = sodium.from_base64(publicKey, variant);

    const encryptedBytes = sodium.crypto_box_seal(messageBytes, keyBytes);

    return sodium.to_base64(encryptedBytes, variant);
  }
}
