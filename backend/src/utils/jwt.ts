import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtAccessPayload {
  sub: string;   // userId
  role: string;
}

export interface JwtRefreshPayload {
  sub: string;   // userId
}

export function signAccessToken(payload: JwtAccessPayload): string {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(payload: JwtRefreshPayload): string {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): JwtAccessPayload {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtAccessPayload;
}

export function verifyRefreshToken(token: string): JwtRefreshPayload {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as JwtRefreshPayload;
}
