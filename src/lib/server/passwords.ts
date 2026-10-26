import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const BCRYPT_ROUNDS = 12;

/** Politique minimale : 10 à 128 caractères, au moins une lettre et un chiffre. */
export const passwordSchema = z
  .string()
  .min(10, 'Le mot de passe doit contenir au moins 10 caractères.')
  .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères.')
  .refine((value) => /[A-Za-zÀ-ÿ]/.test(value) && /\d/.test(value), {
    message: 'Le mot de passe doit contenir au moins une lettre et un chiffre.',
  });

export function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

/** Mot de passe temporaire lisible (sans caractères ambigus), conforme à la politique. */
export function generateTemporaryPassword(length = 14) {
  const letters = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
  const digits = '23456789';
  const alphabet = letters + digits;
  const bytes = crypto.randomBytes(length);
  const chars = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]);
  chars[0] = letters[bytes[0] % letters.length];
  chars[length - 1] = digits[bytes[length - 1] % digits.length];
  return chars.join('');
}

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1_000;

export function generateResetToken() {
  const token = crypto.randomBytes(32).toString('base64url');
  return { token, tokenHash: hashResetToken(token) };
}

export function hashResetToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
