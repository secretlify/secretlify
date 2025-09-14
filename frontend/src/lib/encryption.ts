export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export class Encryption {
  public static async generateKeyPair(): Promise<KeyPair> {
    const subtle = this.getSubtle();
    const keyPair = await subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    const publicSpki = await subtle.exportKey("spki", keyPair.publicKey);
    const privatePkcs8 = await subtle.exportKey("pkcs8", keyPair.privateKey);

    return {
      publicKey: this.arrayBufferToBase64(publicSpki),
      privateKey: this.arrayBufferToBase64(privatePkcs8),
    };
  }

  public static async encryptAsymetric(
    data: string,
    publicKey: string
  ): Promise<string> {
    const subtle = this.getSubtle();
    const pubKey = await subtle.importKey(
      "spki",
      this.base64ToArrayBuffer(publicKey),
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt"]
    );
    const ciphertext = await subtle.encrypt(
      { name: "RSA-OAEP" },
      pubKey,
      this.utf8ToBytes(data)
    );
    return this.arrayBufferToBase64(ciphertext);
  }

  public static async decryptAsymetric(
    data: string,
    privateKey: string
  ): Promise<string> {
    const subtle = this.getSubtle();
    const privKey = await subtle.importKey(
      "pkcs8",
      this.base64ToArrayBuffer(privateKey),
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["decrypt"]
    );
    const plaintext = await subtle.decrypt(
      { name: "RSA-OAEP" },
      privKey,
      this.base64ToArrayBuffer(data)
    );
    return this.bytesToUtf8(new Uint8Array(plaintext));
  }

  public static async encrypt(data: string, key: string): Promise<string> {
    const subtle = this.getSubtle();
    const keyBytes = new Uint8Array(this.base64ToArrayBuffer(key));
    if (keyBytes.length !== 32) {
      throw new Error("Invalid key. Expected 32-byte key (base64-encoded)");
    }
    const cryptoKey = await subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );
    const iv = this.randomBytes(12); // 96-bit nonce recommended for AES-GCM
    const ciphertext = await subtle.encrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      this.utf8ToBytes(data)
    );
    // Package: [iv(12)] + [ciphertext]
    const out = this.concatBytes(iv, new Uint8Array(ciphertext));
    return this.bytesToBase64(out);
  }

  public static async decrypt(data: string, key: string): Promise<string> {
    const subtle = this.getSubtle();
    const keyBytes = new Uint8Array(this.base64ToArrayBuffer(key));
    if (keyBytes.length !== 32) {
      throw new Error("Invalid key. Expected 32-byte key (base64-encoded)");
    }
    const input = new Uint8Array(this.base64ToArrayBuffer(data));
    if (input.length < 12 + 16) {
      throw new Error("Ciphertext too short");
    }
    const iv = input.subarray(0, 12);
    const ciphertext = input.subarray(12);
    const cryptoKey = await subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    const plaintext = await subtle.decrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      ciphertext
    );
    return this.bytesToUtf8(new Uint8Array(plaintext));
  }

  public static serializeKeyPair(keyPair?: KeyPair): string {
    if (!keyPair) {
      throw new Error("KeyPair required for serialization");
    }
    return JSON.stringify({
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
    });
  }

  public static deserializeKeyPair(serializedKeyPair: string): KeyPair {
    const obj = JSON.parse(serializedKeyPair);
    if (
      !obj ||
      typeof obj.publicKey !== "string" ||
      typeof obj.privateKey !== "string"
    ) {
      throw new Error("Invalid serialized key pair");
    }
    return { publicKey: obj.publicKey, privateKey: obj.privateKey };
  }

  // Helpers
  private static utf8ToBytes(data: string): Uint8Array {
    return new TextEncoder().encode(data);
  }

  private static bytesToUtf8(data: Uint8Array): string {
    return new TextDecoder().decode(data);
  }

  private static randomBytes(length: number): Uint8Array {
    const array = new Uint8Array(length);
    (globalThis.crypto || (globalThis as any).msCrypto).getRandomValues(array);
    return array;
  }

  private static concatBytes(...arrays: Uint8Array[]): Uint8Array {
    let total = 0;
    for (const a of arrays) total += a.length;
    const out = new Uint8Array(total);
    let offset = 0;
    for (const a of arrays) {
      out.set(a, offset);
      offset += a.length;
    }
    return out;
  }

  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    return this.bytesToBase64(bytes);
  }

  private static base64ToArrayBuffer(b64: string): ArrayBuffer {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private static bytesToBase64(bytes: Uint8Array): string {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private static getSubtle(): SubtleCrypto {
    const cryptoObj = (globalThis.crypto || (globalThis as any).msCrypto) as
      | Crypto
      | undefined;
    if (!cryptoObj || !cryptoObj.subtle) {
      throw new Error(
        "Web Crypto SubtleCrypto not available in this environment"
      );
    }
    return cryptoObj.subtle;
  }
}
