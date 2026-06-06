import { createContext } from 'react';
import type { User } from '@auth/authTypes';

interface AuthContextType {
   user: User | null;
   setUser: (user: User | null) => void;
   loading: boolean;
   isAuthenticated: boolean | undefined;
   logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
