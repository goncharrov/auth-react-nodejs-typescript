import { useState } from 'react';
import axios from 'axios';

export interface ErrorModalState {
   isOpen: boolean;
   title: string;
   reason: string | null;
   explanation: string | null;
   example: string | null;
}

function getErrorMessage(err: unknown): string {
   return err instanceof Error ? err.message : String(err);
}

export function useErrorModal() {
   const [errorModal, setErrorModal] = useState<ErrorModalState>({
      isOpen: false,
      title: 'Error',
      reason: '',
      explanation: '',
      example: '',
   });

   const showError = (
      reason: string | null,
      explanation: string | null,
      example: string | null
   ) => {
      setErrorModal({
         isOpen: true,
         title: 'Error',
         reason: reason ?? '',
         explanation: explanation ?? '',
         example: example ?? '',
      });
   };

   const showAxiosError = (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
         const data: unknown = error.response.data;
         const msg =
            data !== null &&
            typeof data === 'object' &&
            'message' in data &&
            typeof (data as Record<string, unknown>).message === 'string'
               ? ((data as Record<string, unknown>).message as string)
               : null;
         showError(null, msg, null);
      } else {
         showError(null, getErrorMessage(error), null);
      }
   };

   const closeError = () =>
      setErrorModal((prev) => ({ ...prev, isOpen: false }));

   return { errorModal, showError, showAxiosError, closeError };
}
