import { nanoid, customAlphabet } from 'nanoid'
import { Buffer } from './buffer-type';
import * as crypto from 'crypto';
import { v1, v4 } from 'uuid';

const AToZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const aToz = 'abcdefghijklmnopqrstuvwxyz';
const Numbers = '0123456789';

export const Alphabet = {
  /** A-Z */
  AToZ,
  /** a-z */
  aToz,
  /** 0-9 */
  Numbers,
  /** Alphanumeric + special characters */
  Password: AToZ + aToz + Numbers + '+=!@#$%^&*()":;?><,.'
}

export interface Random {
  /** Random bytes */
  bytes(length: number): Buffer;
  /** Random string id */
  id(length?: number, alphabet?: string): string;

  /** UUID v1: (timestamp) UUID */
  uuid1(): string;
  /** UUID v4: (random) UUID */
  uuid4(): string;

  Alphabet: typeof Alphabet;
}

export const random: Random = {
  bytes: (length: number) => {
    return crypto.randomBytes(length);
  },
  id: (length?: number, alphabet?: string) => {
    if (alphabet) {
      const generator = customAlphabet(alphabet, length ?? 10);
      return generator();
    }
    return nanoid(length);
  },
  uuid1: () => {
    return v1();
  },
  uuid4: () => {
    return v4();
  },
  Alphabet,
}
