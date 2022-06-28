import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';

const protect = async (req: Request, res: Response, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decodedUser.id;
        next();
      } catch (error) {
        if (error instanceof Error)
          res.status(403).json({ message: '登录过期, 请重新登录!', stack: error.stack });
      }
    } catch (error) {
      if (error instanceof Error)
        res.status(403).json({ message: '登录过期, 请重新登录!', stack: error.stack });
    }
  } else {
    res.status(401).json({ message: '未授权!' });
  }
};

export default protect;
