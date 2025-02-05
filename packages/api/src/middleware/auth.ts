import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = { id: user.id };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
