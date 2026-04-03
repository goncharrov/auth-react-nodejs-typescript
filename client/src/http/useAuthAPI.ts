import { useState, useEffect } from 'react';
import { useCsrf } from '@http/useCsrfAPI';
import type {
   User,
   AuthResponse,
   CheckEmailResponse,
   SendNewEmailCodeResponse,
} from '@type/authTypes';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

export function useAuth() {
   const [user, setUser] = useState<User | null>(null);
   const [userLoading, setUserLoading] = useState<boolean>(true);
   const [isInitialized, setIsInitialized] = useState<boolean>(false);

   const {
      csrfToken,
      loading: csrfLoading,
      error: csrfError,
      refreshCsrfToken,
      updateCsrfToken,
   } = useCsrf();

   // ===== Getting current user =====
   useEffect(() => {
      if (csrfLoading) {
         return;
      }

      const fetchUser = async () => {
         try {
            setUserLoading(true);
            const response = await fetch(`${API_URL}/api/auth/user`, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
               },
               credentials: 'include',
            });

            if (!response.ok) {
               throw new Error(`Error HTTP: ${response.status}`);
            }

            const json: unknown = await response.json();
            const data = json as AuthResponse;

            if (data.success) {
               setUser(data.user);
            } else {
               setUser(null);
            }
         } catch (err) {
            console.error('Error fetching user:', err);
            setUser(null);
         } finally {
            setUserLoading(false);
            setIsInitialized(true);
         }
      };

      void fetchUser();
   }, [csrfLoading]);

   const loginWithPassword = async (
      email: string,
      password: string
   ): Promise<{ success: true; user: User }> => {
      if (csrfError) {
         throw new Error(`Error loading CSRF token: ${csrfError.message}`);
      }

      if (!csrfToken) {
         throw new Error('CSRF token not loaded');
      }

      try {
         const response = await fetch(
            `${API_URL}/api/auth/login-with-password`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-csrf-token': csrfToken,
               },
               credentials: 'include',
               body: JSON.stringify({ email, password }),
            }
         );

         const json: unknown = await response.json();
         const data = json as AuthResponse;

         if (data.success) {
            setUser(data.user);
            if (data.csrfToken) {
               updateCsrfToken(data.csrfToken);
            } else {
               await refreshCsrfToken();
            }
            return { success: true, user: data.user };
         } else {
            throw new Error(data.error || 'Error during login');
         }
      } catch (err: unknown) {
         const e = err as {
            response?: { data?: { error?: string } };
            message?: string;
         };
         const errorMessage =
            e.response?.data?.error || e.message || 'Error during login';
         throw new Error(errorMessage);
      }
   };

   const loginWithCode = async (
      email: string,
      code: string
   ): Promise<{ success: true; user: User }> => {
      if (csrfError) {
         throw new Error(`Error loading CSRF token: ${csrfError.message}`);
      }

      if (!csrfToken) {
         throw new Error('CSRF token not loaded');
      }

      try {
         const response = await fetch(`${API_URL}/api/auth/login-with-code`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-csrf-token': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify({ email, code }),
         });

         const json: unknown = await response.json();
         const data = json as AuthResponse;

         if (data.success) {
            setUser(data.user);
            if (data.csrfToken) {
               updateCsrfToken(data.csrfToken);
            } else {
               await refreshCsrfToken();
            }
            return { success: true, user: data.user };
         } else {
            throw new Error(data.error || 'Error during login');
         }
      } catch (err: unknown) {
         const e = err as {
            response?: { data?: { error?: string } };
            message?: string;
         };
         const errorMessage =
            e.response?.data?.error || e.message || 'Error during login';
         throw new Error(errorMessage);
      }
   };

   const registration = async (
      formData: Record<string, unknown>
   ): Promise<{ success: true; user: User }> => {
      if (csrfError) {
         throw new Error(`Error loading CSRF token: ${csrfError.message}`);
      }

      if (!csrfToken) {
         throw new Error('CSRF token not loaded');
      }

      try {
         const response = await fetch(`${API_URL}/api/auth/registration`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-csrf-token': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify(formData),
         });

         if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
         }

         const json: unknown = await response.json();
         const data = json as AuthResponse;

         if (data.success) {
            setUser(data.user);
            if (data.csrfToken) {
               updateCsrfToken(data.csrfToken);
            } else {
               await refreshCsrfToken();
            }
            return { success: true, user: data.user };
         } else {
            throw new Error(data.error || 'Error during registration');
         }
      } catch (err: unknown) {
         const e = err as {
            response?: { data?: { error?: string } };
            message?: string;
         };
         const errorMessage =
            e.response?.data?.error || e.message || 'Error during registration';
         throw new Error(errorMessage);
      }
   };

   const checkEmail = async (email: string): Promise<CheckEmailResponse> => {
      if (csrfError) {
         throw new Error(`Error loading CSRF token: ${csrfError.message}`);
      }

      if (!csrfToken) {
         throw new Error('CSRF token not loaded');
      }

      try {
         const response = await fetch(`${API_URL}/api/auth/check-email`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-csrf-token': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify({ email }),
         });

         if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
         }

         const json: unknown = await response.json();
         const data = json as CheckEmailResponse;

         if (data.success) {
            if (data.csrfToken) {
               updateCsrfToken(data.csrfToken);
            }
            return data;
         } else {
            throw new Error(data.error || 'Error during email checking');
         }
      } catch (err: unknown) {
         const e = err as {
            response?: { data?: { error?: string } };
            message?: string;
         };
         const errorMessage =
            e.response?.data?.error ||
            e.message ||
            'Error during email checking';
         throw new Error(errorMessage);
      }
   };

   const sendNewEmailCode = async (
      email: string
   ): Promise<SendNewEmailCodeResponse> => {
      if (csrfError) {
         throw new Error(`Error loading CSRF token: ${csrfError.message}`);
      }

      if (!csrfToken) {
         throw new Error('CSRF token not loaded');
      }

      try {
         const response = await fetch(
            `${API_URL}/api/auth/send-new-login-code`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-csrf-token': csrfToken,
               },
               credentials: 'include',
               body: JSON.stringify({ email }),
            }
         );

         if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
         }

         const json: unknown = await response.json();
         const data = json as SendNewEmailCodeResponse;

         if (data.csrfToken) {
            updateCsrfToken(data.csrfToken);
         }

         return data;
      } catch (err: unknown) {
         const e = err as {
            response?: { data?: { error?: string } };
            message?: string;
         };
         const errorMessage =
            e.response?.data?.error ||
            e.message ||
            'Error sending code. Login with email';
         throw new Error(errorMessage);
      }
   };

   const logout = async (): Promise<void> => {
      if (csrfError) {
         throw new Error(`Error loading CSRF token: ${csrfError.message}`);
      }

      if (!csrfToken) {
         setUser(null);
         return;
      }

      try {
         await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-csrf-token': csrfToken,
            },
            credentials: 'include',
         });
      } catch (err) {
         console.error('Error during logout:', err);
      } finally {
         setUser(null);
         await refreshCsrfToken();
      }
   };

   const isAuthenticated: boolean | undefined = isInitialized
      ? !!user
      : undefined;

   const loading: boolean = csrfLoading || userLoading;

   return {
      user,
      setUser,
      isAuthenticated,
      loading,
      loginWithPassword,
      loginWithCode,
      registration,
      checkEmail,
      sendNewEmailCode,
      logout,
   };
}
