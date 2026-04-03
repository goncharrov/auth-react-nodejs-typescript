import { useState, useEffect } from 'react';
import type { CsrfResponse, CsrfHookResult } from '@type/authTypes';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

export function useCsrf(): CsrfHookResult {
   const [csrfToken, setCsrfToken] = useState<string | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<Error | null>(null);

   const getCsrfToken = async (): Promise<void> => {
      try {
         setLoading(true);
         setError(null);

         const response = await fetch(`${API_URL}/api/csrf-token`, {
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
         const data = json as CsrfResponse;

         if (data.success && data.csrfToken) {
            setCsrfToken(data.csrfToken);
         }
      } catch (err) {
         console.error('Error fetching CSRF token:', err);
         setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
         setLoading(false);
      }
   };

   // Getting CSRF token
   useEffect(() => {
      const fetchCsrfToken = async () => {
         await getCsrfToken();
      };
      void fetchCsrfToken();
   }, []);

   // Refreshing the CSRF token after operations
   const refreshCsrfToken = async (): Promise<void> => {
      await getCsrfToken();
   };

   // Refreshing the token from the server response
   const updateCsrfToken = (token: string | null): void => {
      if (token) {
         setCsrfToken(token);
         setError(null);
      }
   };

   return { csrfToken, loading, error, refreshCsrfToken, updateCsrfToken };
}
