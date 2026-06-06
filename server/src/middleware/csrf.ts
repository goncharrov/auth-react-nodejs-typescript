import { randomBytes } from 'crypto';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

const CSRF_HEADER = 'x-csrf-token';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function generateToken(req: Request): string {
   if (!req.session.csrfToken) {
      req.session.csrfToken = randomBytes(32).toString('hex');
   }
   return req.session.csrfToken;
}

export function csrfTokenHandler(req: Request, res: Response): void {
   const token = generateToken(req);
   res.json({ csrfToken: token });
}

export function csrfProtection(): RequestHandler {
   return (req: Request, res: Response, next: NextFunction): void => {
      if (SAFE_METHODS.has(req.method)) {
         next();
         return;
      }

      const headerToken = req.headers[CSRF_HEADER];
      const sessionToken = req.session.csrfToken;

      if (!sessionToken || headerToken !== sessionToken) {
         res.status(403).json({ message: 'Invalid CSRF token' });
         return;
      }

      next();
   };
}
