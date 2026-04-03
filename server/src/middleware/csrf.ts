import csrf from 'csrf';
import { Request, Response, NextFunction } from 'express';

const tokens = new csrf();

// Генерация CSRF токена

export function generateCsrfToken(
   req: Request,
   res: Response,
   next: NextFunction
) {
   if (!req.session) {
      return next(
         new Error(
            'Session is not available (store error or middleware order). Check session logs.'
         )
      );
   }

   if (!req.session.secret) {
      req.session.secret = tokens.secretSync();
   }

   const token = tokens.create(req.session.secret);
   req.session.csrfToken = token;
   res.locals.csrfToken = token;

   next();
}

// Валидация CSRF токена

export function validateCsrfToken(
   req: Request,
   res: Response,
   next: NextFunction
) {
   if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      return next();
   }

   const token =
      (req.headers['x-csrf-token'] as string | undefined) ||
      (req.body && (req.body._csrf as string | undefined));

   const secret = req.session?.secret;

   if (!req.session || !secret || !token) {
      return res.status(403).json({
         success: false,
         error: 'CSRF token missing',
      });
   }

   const isValid = tokens.verify(secret, token);

   if (!isValid) {
      return res.status(403).json({
         success: false,
         error: 'Invalid CSRF token',
      });
   }

   next();
}
