import { useCsrf } from '@http/useCsrfAPI';
import { useAuth } from '@http/useAuthAPI';
import type { Gender, ContactType } from '@type/accountTypes';
import type { User } from '@type/authTypes';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

interface ApiBaseResponse {
   success: boolean;
   error?: string;
   csrfToken?: string;
}

export interface SaveUserDataRequest {
   firstName: string;
   lastName: string;
   preferredName?: string;
   gender?: { label: Gender } | null;
   birthday?: string | Date | null;
}

interface SaveUserDataResponse extends ApiBaseResponse {
   user?: User;
   message?: string;
}

interface GetUserVerificationCodeRequest {
   type: ContactType;
   isNewValue: boolean;
   newValue?: string | null;
}

interface GetUserVerificationCodeResponse extends ApiBaseResponse {
   isCodeWritten?: boolean;
   isContactDataEmpty?: boolean;
}

type CheckUserVerificationCodeResponse = ApiBaseResponse;

interface CheckUserContactDataRequest {
   type: ContactType;
   value: string;
}

type CheckUserContactDataResponse = ApiBaseResponse;

interface WriteNewUserContactDataRequest {
   type: ContactType;
   value: string;
   code: string;
}

interface WriteNewUserContactDataResponse extends ApiBaseResponse {
   user?: User;
   message?: string;
}

type CheckUserPasswordResponse = ApiBaseResponse;

type WriteNewUserPasswordResponse = ApiBaseResponse;

type DeleteUserAccountResponse = ApiBaseResponse;

export function useAccount() {
   const {
      csrfToken,
      error: csrfError,
      refreshCsrfToken,
      updateCsrfToken,
   } = useCsrf();

   const { setUser } = useAuth();

   const ensureCsrf = () => {
      if (csrfError) {
         throw new Error(`Error loading CSRF token: ${csrfError.message}`);
      }
      if (!csrfToken) {
         throw new Error('CSRF token not loaded');
      }
   };

   const saveUserData = async (
      userData: SaveUserDataRequest
   ): Promise<{ success: true; user: User }> => {
      ensureCsrf();

      try {
         const response = await fetch(`${API_URL}/api/account/save-user-data`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-csrf-token': csrfToken!,
            },
            credentials: 'include',
            body: JSON.stringify(userData),
         });

         const json: unknown = await response.json();
         const data = json as SaveUserDataResponse;

         if (data.success && data.user) {
            if (data.csrfToken) {
               updateCsrfToken(data.csrfToken);
            } else {
               await refreshCsrfToken();
            }
            return { success: true, user: data.user };
         }

         throw new Error(data.error || 'Error during saving user data');
      } catch (err: unknown) {
         const errorObj = err as {
            message?: string;
            response?: { data?: { error?: string } };
         };
         const errorMessage =
            errorObj.response?.data?.error ||
            errorObj.message ||
            'Error during save user data';
         throw new Error(errorMessage);
      }
   };

   const getUserVerificationCode = async (
      context: GetUserVerificationCodeRequest
   ): Promise<GetUserVerificationCodeResponse> => {
      ensureCsrf();

      try {
         const response = await fetch(
            `${API_URL}/api/account/get-user-verification-code`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-csrf-token': csrfToken!,
               },
               credentials: 'include',
               body: JSON.stringify(context),
            }
         );

         const json: unknown = await response.json();
         const data = json as GetUserVerificationCodeResponse;

         if (data.success) {
            if (data.csrfToken) {
               updateCsrfToken(data.csrfToken);
            } else {
               await refreshCsrfToken();
            }
            return data;
         }

         throw new Error(
            data.error || 'Error during writing verification code'
         );
      } catch (err: unknown) {
         const errorObj = err as {
            message?: string;
            response?: { data?: { error?: string } };
         };
         const errorMessage =
            errorObj.response?.data?.error ||
            errorObj.message ||
            'Error during writing verification code';
         throw new Error(errorMessage);
      }
   };

   const checkUserVerificationCode = async (
      code: string
   ): Promise<CheckUserVerificationCodeResponse> => {
      ensureCsrf();

      try {
         const response = await fetch(
            `${API_URL}/api/account/check-user-verification-code`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-csrf-token': csrfToken!,
               },
               credentials: 'include',
               body: JSON.stringify({ code }),
            }
         );

         const json: unknown = await response.json();
         const data = json as CheckUserVerificationCodeResponse;

         if (data.success) {
            if (data.csrfToken) {
               updateCsrfToken(data.csrfToken);
            } else {
               await refreshCsrfToken();
            }
            return data;
         }

         throw new Error(data.error || 'Error during check verification code');
      } catch (err: unknown) {
         const errorObj = err as {
            message?: string;
            response?: { data?: { error?: string } };
         };
         const errorMessage =
            errorObj.response?.data?.error ||
            errorObj.message ||
            'Error during check verification code';
         throw new Error(errorMessage);
      }
   };

   const checkUserContactData = async (
      context: CheckUserContactDataRequest
   ): Promise<CheckUserContactDataResponse> => {
      ensureCsrf();

      try {
         const response = await fetch(
            `${API_URL}/api/account/check-user-contact-data`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-csrf-token': csrfToken!,
               },
               credentials: 'include',
               body: JSON.stringify(context),
            }
         );

         const json: unknown = await response.json();
         const data = json as CheckUserContactDataResponse;

         if (data.success) {
            if (data.csrfToken) {
               updateCsrfToken(data.csrfToken);
            } else {
               await refreshCsrfToken();
            }
            return data;
         }

         throw new Error(data.error || 'Error during check verification code');
      } catch (err: unknown) {
         const errorObj = err as {
            message?: string;
            response?: { data?: { error?: string } };
         };
         const errorMessage =
            errorObj.response?.data?.error ||
            errorObj.message ||
            'Error during check verification code';
         throw new Error(errorMessage);
      }
   };

   const writeNewUserContactData = async (
      context: WriteNewUserContactDataRequest
   ): Promise<WriteNewUserContactDataResponse> => {
      ensureCsrf();

      try {
         const response = await fetch(
            `${API_URL}/api/account/write-new-user-contact-data`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-csrf-token': csrfToken!,
               },
               credentials: 'include',
               body: JSON.stringify(context),
            }
         );

         const json: unknown = await response.json();
         const data = json as WriteNewUserContactDataResponse;

         if (data.success) {
            if (data.csrfToken) {
               updateCsrfToken(data.csrfToken);
            } else {
               await refreshCsrfToken();
            }
            return data;
         }

         throw new Error(
            data.error || 'Error during writing new user contact data'
         );
      } catch (err: unknown) {
         const errorObj = err as {
            message?: string;
            response?: { data?: { error?: string } };
         };
         const errorMessage =
            errorObj.response?.data?.error ||
            errorObj.message ||
            'Error during writing new user contact data';
         throw new Error(errorMessage);
      }
   };

   const checkUserPassword = async (
      password: string
   ): Promise<CheckUserPasswordResponse> => {
      ensureCsrf();

      try {
         const response = await fetch(
            `${API_URL}/api/account/check-user-password`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-csrf-token': csrfToken!,
               },
               credentials: 'include',
               body: JSON.stringify({ password }),
            }
         );

         const json: unknown = await response.json();
         const data = json as CheckUserPasswordResponse;

         if (data.success) {
            if (data.csrfToken) {
               updateCsrfToken(data.csrfToken);
            } else {
               await refreshCsrfToken();
            }
            return data;
         }

         throw new Error(data.error || 'Error during check user password');
      } catch (err: unknown) {
         const errorObj = err as {
            message?: string;
            response?: { data?: { error?: string } };
         };
         const errorMessage =
            errorObj.response?.data?.error ||
            errorObj.message ||
            'Error during check user password';
         throw new Error(errorMessage);
      }
   };

   const writeNewUserPassword = async (
      password: string
   ): Promise<WriteNewUserPasswordResponse> => {
      ensureCsrf();

      try {
         const response = await fetch(
            `${API_URL}/api/account/write-new-user-password`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-csrf-token': csrfToken!,
               },
               credentials: 'include',
               body: JSON.stringify({ password }),
            }
         );

         const json: unknown = await response.json();
         const data = json as WriteNewUserPasswordResponse;

         if (data.success) {
            if (data.csrfToken) {
               updateCsrfToken(data.csrfToken);
            } else {
               await refreshCsrfToken();
            }
            return data;
         }

         throw new Error(
            data.error || 'Error during writing new user password'
         );
      } catch (err: unknown) {
         const errorObj = err as {
            message?: string;
            response?: { data?: { error?: string } };
         };
         const errorMessage =
            errorObj.response?.data?.error ||
            errorObj.message ||
            'Error during writing new user password';
         throw new Error(errorMessage);
      }
   };

   const deleteUserAccount = async (
      password: string
   ): Promise<DeleteUserAccountResponse | void> => {
      ensureCsrf();

      try {
         const response = await fetch(
            `${API_URL}/api/account/delete-user-account`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-csrf-token': csrfToken!,
               },
               credentials: 'include',
               body: JSON.stringify({ password }),
            }
         );

         const json: unknown = await response.json();
         const data = json as DeleteUserAccountResponse;

         if (data.success) {
            setUser(null);
            await refreshCsrfToken();
            return data;
         }

         throw new Error(data.error || 'Error during deleting user account');
      } catch (err) {
         console.error('Error during deleting user account:', err);
      }
   };

   return {
      saveUserData,
      getUserVerificationCode,
      checkUserVerificationCode,
      checkUserContactData,
      writeNewUserContactData,
      checkUserPassword,
      writeNewUserPassword,
      deleteUserAccount,
   };
}
