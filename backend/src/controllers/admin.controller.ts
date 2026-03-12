import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import generateToken from '../utils/generateToken';

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    res.json({
      success: true,
      token: generateToken(email),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});
