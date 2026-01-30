import { Request } from 'express';
export * from './auth.types';

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

export interface CustomRequest extends Request {
  userId?: number;
}
