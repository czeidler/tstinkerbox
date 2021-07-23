import { Buffer } from './buffer-type';

export interface Base64 {
  /** Decodes a base 64 string into a byte buffer */
  decode(value: string): Buffer;
  /** Encodes a byte buffer to a Base64 string */
  encode(input: Buffer): string;
}

export interface Bytes {
  /** Converts a string to a byte buffer */
  fromString(input: string): Buffer;
  /** Interprets a byte buffer as a string */
  toString(buffer: Buffer): string;
}

export interface Hex {
  /** Encodes a byte buffer as a hex string */
  encode(input: Buffer): string;
}

export interface Encoding {
  /** Base64 encoding */
  base64: Base64;
  /** Byte buffer transformations */
  bytes: Bytes;
  /** Hex encoding */
  hex: Hex;
}

export const encoding: Encoding = {
  base64: {
    decode: (value: string) => {
      return Buffer.from(value, 'base64');
    },

    encode: (input: Buffer) => {
      return input.toString('base64');
    },
  },

  bytes: {
    fromString: (input: string) => {
      return Buffer.from(input);
    },

    toString: (buffer: Buffer) => {
      return buffer.toString();
    },
  },

  hex: {
    encode: (input: Buffer) => {
      return Array.from(input, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2))
        .join('');
    },
  },
}