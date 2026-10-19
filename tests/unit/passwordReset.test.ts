import { describe, it } from 'node:test';
import assert from 'node:assert';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

describe('Password Reset Logic & Security', () => {
  it('generates secure 64-character hexadecimal reset tokens', () => {
    const token = crypto.randomBytes(32).toString('hex');
    assert.strictEqual(typeof token, 'string');
    assert.strictEqual(token.length, 64);
  });

  it('verifies token expiration calculation', () => {
    const now = Date.now();
    const expiresOneHour = new Date(now + 3600000);
    const expiredToken = new Date(now - 1000);

    assert.strictEqual(expiresOneHour > new Date(), true);
    assert.strictEqual(expiredToken < new Date(), true);
  });

  it('hashes and validates updated passwords with bcrypt', async () => {
    const rawPassword = 'newSecretKeyora2026!';
    const hashed = await bcrypt.hash(rawPassword, 10);

    assert.notStrictEqual(hashed, rawPassword);
    const isValid = await bcrypt.compare(rawPassword, hashed);
    assert.strictEqual(isValid, true);

    const isWrong = await bcrypt.compare('wrongPassword', hashed);
    assert.strictEqual(isWrong, false);
  });
});
