import enviroment from './enviroments';

if (process.env.NODE_ENV !== 'production') {
  const env = enviroment;
}

export const SECRET_KEY = process.env.SECRET || 'IHAVEanamazingSECRETwhichIS090920';

export enum COLLECTIONS {
  USERS = 'users',
  GENRES = 'genres',
  TAGS = 'tags'
}

export enum MESSAGES {
  TOKEN_VERIFICATION_FAILED = 'Invalid token. Log in again'
}

/**
 * H = Hours
 * M = Minutes
 * D = Days
 */

 export enum EXPIRETIME {
   H1 = 60 * 60,
   H24 = 24 * H1,
   M15 = H1 / 4,
   M20 = H1 / 3,
   D3 = H24 * 3
 }

 export enum ACTIVE_VALUES_FILTER {
  ALL = 'ALL',
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE'
}