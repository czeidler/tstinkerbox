const jsonwebtoken = require('jsonwebtoken');

export interface JWT {
  /** Decodes a JWT token */
  decode(token: string): object;
}

export const jwt: JWT = {
  decode: (token: string) => {
    return jsonwebtoken.decode(token, { complete: true });
  }
}