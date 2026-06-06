import 'express-session';

declare module 'express-session' {
   interface SessionData {
      csrfToken?: string;
      userId?: number;
      isAuthenticated?: boolean;
   }
}

export type UserData = {
   firstName: string | null;
   lastName: string | null;
   preferredName: string | null;
   email: string;
   phone: string | null;
   birthday: Date | null;
   gender: string | null;
   role: string;
};