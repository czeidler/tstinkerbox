const pako = require('pako');

export interface ZLib {
  /** Deflates (zips) the input data */
  deflate(input: Buffer | string): Buffer;
  /** Inflates (unzips) the input data */
  inflate(input: Buffer): Buffer;

  /** Inflates (unzips) the input data */
  inflateToString(input: Buffer): string;
}

export const zlib: ZLib = {
  deflate: (input: Buffer | string) => {
    return pako.deflate(input);
  },

  inflate: (input: Buffer) => {
    const rawResult: Uint8Array = pako.inflate(input);
    return Buffer.from(rawResult);
  },

  inflateToString: (input: Buffer) => {
    return pako.inflate(input, { to: 'string' });
  },
}
