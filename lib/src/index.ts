import { encoding } from './encoding';
import { hashing } from './hashing';
import { http } from './http';
import { jwt } from './jwt';
import { time } from './time';
import { typescript } from './typescript';
import { random } from './random';
import { zlib } from './zlib';

export const tb = {
  /** Encoding like, hex, bytes, base64 */
  encoding,
  /** Hash functions such as sha1 or sha256 */
  hashing,
  /** HTTP requests */
  http,
  /** JSON web token */
  jwt,
  /** Random ids or bytes*/
  random,
  /** Time and date */
  time,
  /** TypeScript related helper */
  typescript,
  /** Lib to zip/unzip files */
  zlib,
}

/** Use the original console log */
const consoleLog = console.log;

export function println(message?: any, ...optionalParams: any[]) {
  consoleLog(message, ...optionalParams);
}