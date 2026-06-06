import api from '@shared/http/axiosInstance';
import type { User, RegUserData } from '../auth/authTypes';

export interface AuthApiResponce {
   success: boolean;
   message?: string;
}

export interface CheckEmailResponce extends AuthApiResponce {
   exists: boolean;
   authorizationType: 'code' | 'password';
}

export interface UserDataResponce extends AuthApiResponce {
   user: User;
}

export interface UserLoginCodeResponce extends AuthApiResponce {
   codeIsWritten: boolean;
}

export const authApi = {
   checkEmail: (email: string) => 
      api.post<CheckEmailResponce>('/auth/check-email', { email }),

   loginWithPassword: (email: string, password: string) =>
      api.post<UserDataResponce>('/auth/login-with-password', { email, password } ),

   loginWithCode: ( email: string, code: string ) => 
      api.post<UserDataResponce>('/auth/login-with-code', { email, code }),

   sendNewLoginCode: (email: string) => 
      api.post<UserLoginCodeResponce>('/auth/send-new-login-code', { email }),

   registration: (formData: RegUserData) => 
      api.post<UserDataResponce>('/auth/registration', formData),

   getCurrentUser: () => api.get<UserDataResponce>('/auth/user'),

   logout: () => api.post<AuthApiResponce>('/auth/logout'),

}

