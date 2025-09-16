export function getSubtle(): SubtleCrypto {
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

export function utf8ToBytes(data: string): Uint8Array {
  return new TextEncoder().encode(data);
}

export function bytesToUtf8(data: Uint8Array): string {
  return new TextDecoder().decode(data);
}

export function randomBytes(length: number): Uint8Array {
  const array = new Uint8Array(length);
  (globalThis.crypto || (globalThis as any).msCrypto).getRandomValues(array);
  return array;
}

export function concatBytes(...arrays: Uint8Array[]): Uint8Array {
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

export function u8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToU8(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return u8ToBase64(new Uint8Array(buffer));
}

export function base64ToArrayBuffer(b64: string): ArrayBuffer {
  return base64ToU8(b64).buffer;
}

export function createRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}
