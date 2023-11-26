import * as bcrypt from 'bcrypt';
import { AppConstant } from './app-constant';

export const encrypt = async (data: string) => {
  return bcrypt.hash(data, AppConstant.SALT);
};

export const compare = async (data: string, encrypted: string) => {
  return bcrypt.compare(data, encrypted);
};
