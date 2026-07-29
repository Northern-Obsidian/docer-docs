import CryptoJS from 'crypto-js';
import { storage } from '@/storage';

const NOTE_ENCRYPTION_KEY = 'note_encryption_enabled';
const AES_KEY_STORE = 'note_aes_key';

export function isNoteEncryptionEnabled(): boolean {
  return storage.getBoolean(NOTE_ENCRYPTION_KEY) ?? false;
}

export function setNoteEncryptionEnabled(enabled: boolean): void {
  storage.set(NOTE_ENCRYPTION_KEY, enabled);
}

function getOrCreateAesKey(): string {
  const existing = storage.getString(AES_KEY_STORE);
  if (existing) return existing;
  const key = CryptoJS.lib.WordArray.random(256 / 8).toString();
  storage.set(AES_KEY_STORE, key);
  return key;
}

export function encryptContent(content: string): string {
  try {
    const key = getOrCreateAesKey();
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const encrypted = CryptoJS.AES.encrypt(content, CryptoJS.enc.Hex.parse(key), {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const result = iv.toString() + ':' + encrypted.ciphertext.toString();
    return `AES:${result}`;
  } catch {
    return content;
  }
}

export function decryptContent(encrypted: string): string {
  if (!encrypted.startsWith('AES:')) return encrypted;
  try {
    const key = getOrCreateAesKey();
    const payload = encrypted.slice(4);
    const [ivHex, cipherHex] = payload.split(':');
    if (!ivHex || !cipherHex) return encrypted;
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const ciphertext = CryptoJS.enc.Hex.parse(cipherHex);
    const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });
    const decrypted = CryptoJS.AES.decrypt(cipherParams, CryptoJS.enc.Hex.parse(key), {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    return result || encrypted;
  } catch {
    return encrypted;
  }
}

export function isEncryptedContent(content: string): boolean {
  return content.startsWith('AES:');
}
