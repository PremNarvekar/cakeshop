import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';

export interface AuthRequest extends Request {
  admin?: boolean;
}

export const adminProtect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      if (decoded.id === process.env.ADMIN_EMAIL) {
        req.admin = true;
        next();
      } else {
        res.status(401);
        throw new Error('Not authorized as admin');
      }
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});
