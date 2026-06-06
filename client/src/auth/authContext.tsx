import { createContext, useEffect, useState, useContext } from "react";
import type { ReactNode } from 'react';

import type { User } from '@auth/authTypes';
import { authApi } from "@auth/authApi";
import { initCsrf } from '@shared/http/axiosInstance';

interface AuthContextType {
   user: User | null;
   setUser: (user: User | null) => void;
   loading: boolean;
   isAuthenticated: boolean | undefined;
   logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      authApi.getCurrentUser()
         .then(res => setUser(res.data.user))
         .catch(() => setUser(null))
         .finally(() => setLoading(false));
   }, []);

   const isAuthenticated = loading ? undefined : !!user;

   const logout = async () => {
      try {
         await authApi.logout();
      } finally {
         setUser(null);
         await initCsrf();
      }
   };

   return (
      <AuthContext.Provider value={{ user, setUser, loading, isAuthenticated, logout }}>
         {children}
      </AuthContext.Provider>
   );
}

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) throw new Error('useAuth must be used within AuthProvider');
   return context;
};
