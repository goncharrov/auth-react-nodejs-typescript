import api from '@shared/http/axiosInstance';
import type { User } from '@auth/authTypes'; 
import type { UserData, ContactType } from '@account/accountTypes';

export interface AccountApiResponce {
   success: boolean;
   message?: string;   
} 

export interface UserDataResponce extends AccountApiResponce {
   user: User;
}

export interface GetUserVerificationCodeResponse extends AccountApiResponce {
   isCodeWritten: boolean;
   isContactDataEmpty: boolean;
}

interface GetUserVerificationCodeRequest {
   type: ContactType;
   isNewValue: boolean;
   newValue?: string | null;
}

interface CheckUserContactDataRequest {
   type: ContactType;
   value: string;
}

interface WriteNewUserContactDataRequest {
   type: ContactType;
   value: string;
   code: string;
}

export const accountApi = {
   saveUserData: (userData: UserData) => 
      api.post<UserDataResponce>('/account/save-user-data', userData),

   getUserVerificationCode: (context: GetUserVerificationCodeRequest) => 
      api.post<GetUserVerificationCodeResponse>('/account/get-user-verification-code', context),

   checkUserVerificationCode: (code: string) =>
      api.post<AccountApiResponce>('/account/check-user-verification-code', { code }),

   checkUserContactData: (context: CheckUserContactDataRequest) => 
      api.post<AccountApiResponce>('/account/check-user-contact-data', context),

   writeNewUserContactData: (context: WriteNewUserContactDataRequest) =>
      api.post<UserDataResponce>('/account/write-new-user-contact-data', context),

   checkUserPassword: (password: string) => 
      api.post<AccountApiResponce>('/account/check-user-password', { password }),

   writeNewUserPassword: (password: string) =>
      api.post<AccountApiResponce>('/account/write-new-user-password', { password }),

   deleteUserAccount: (password: string) =>
      api.post<AccountApiResponce>('/account/delete-user-account', { password }),


}
