import { Response } from 'express';
import { env } from '../config/env';

export const setTokenCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  const isProduction = env.NODE_ENV === 'production';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

export const clearTokenCookies = (res: Response): void => {
  res.cookie('accessToken', '', { httpOnly: true, expires: new Date(0), path: '/' });
  res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0), path: '/' });
};
