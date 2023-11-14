import { randomBytes } from 'crypto';

export const generateHash = () => {
  return randomBytes(32).toString('hex');
};
