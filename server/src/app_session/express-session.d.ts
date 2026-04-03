import 'express-session';
import type { UserData } from '../app_auth/authTypes.js';

declare module 'express-session' {
   interface SessionData {
      secret?: string;
      csrfToken?: string;
      userId?: number;
      user?: UserData;
      isAuthenticated?: boolean;
   }
}
