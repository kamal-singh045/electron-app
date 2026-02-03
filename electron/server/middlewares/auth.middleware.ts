// auth middleware check if the token is valid

import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { CustomRequest } from '../types';

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')?.[1] || '';
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  console.log("Token Verified successfully...");
  req.userId = decodedToken.userId;
  next();
};
