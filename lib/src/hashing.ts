import * as crypto from 'crypto';

export interface Hash {
  /** Hashes the input into a hex string */
  digestToHex(input: Buffer | string): string;
  /** Hashes the input into a byte buffer */
  digest(input: Buffer | string): Buffer;
}

export interface Hashing {
  sha1: Hash;
  sha256: Hash;
}

class Hasher implements Hash {
  constructor(public algo: 'sha256' | 'sha1') { }

  digestToHex(input: Buffer | string): string {
    const hasher = crypto.createHash(this.algo);
    hasher.update(input);
    return hasher.digest('hex');
  }
  digest(input: Buffer | string): Buffer {
    const hasher = crypto.createHash(this.algo);
    hasher.update(input);
    return hasher.digest();
  }
};

export const hashing: Hashing = {
  sha1: new Hasher('sha1'),
  sha256: new Hasher('sha256'),
};
