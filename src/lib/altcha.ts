import { create, deriveHmacKeySecret, randomInt, CappedMap } from 'altcha-lib/frameworks/sveltekit';
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2';
import { env } from '$env/dynamic/private';

// Define your HMAC secret
const HMAC_SECRET = env.ALTCHA_HMAC as string;

export const altcha = create({
  // Verification HMAC secrets
  hmacSignatureSecret: HMAC_SECRET,
  hmacKeySignatureSecret: await deriveHmacKeySecret(HMAC_SECRET),

  // Adjust challenge parameters
  createChallengeParameters: () => {
    return {
      algorithm: 'PBKDF2/SHA-256',
      // Adjust cost and counter depending on the algorithm
      cost: 5_000,
      counter: randomInt(5_000, 10_000),
      expiresAt: new Date(Date.now() + 600_000), // 10 minutes
    };
  },

  // Key derivation function for the selected algorithm
  deriveKey,

  // Use a cookie instead of form data to send the payload
  setCookie: {
    name: 'altcha',
    path: '/',
  },

  // In distributed environments, use Redis or another shared store
  store: new CappedMap<string, boolean>({
    maxSize: 1_000,
  }),
});
