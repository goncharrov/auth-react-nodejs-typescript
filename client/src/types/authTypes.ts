import type { ChangeEvent, MouseEvent } from 'react';

// ===== Auth form types =====

export type LoginFormProps = {
   onNext: (event: MouseEvent<HTMLButtonElement>) => void;
   email: string;
   onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
   validationText: string;
   loading?: boolean;
};

export type CodeFormProps = {
   onBack: (event: MouseEvent<HTMLDivElement>) => void;
   onNext: (event: MouseEvent<HTMLButtonElement>) => void;
   email: string;
   code: string;
   onCodeChange: (event: ChangeEvent<HTMLInputElement>) => void;
   onCodeSubmit: (event: MouseEvent<HTMLButtonElement>) => void;
   validationText: string;
   timerActive: boolean;
   secondsLeft: number;
   onRestart: () => Promise<void>;
};

export type PassFormProps = {
   onBack: (event: MouseEvent<HTMLDivElement>) => void;
   email: string;
   password: string;
   onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
   onPasswordSubmit: (event: MouseEvent<HTMLButtonElement>) => void;
   validationText: string;
   loading: boolean;
};

// ===== Auth API types =====

export interface User {
   email: string;
   phone: string;
   firstName: string;
   lastName: string;
   preferredName: string;
   birthday: string | Date | null;
   gender: string | null;
   role: string;
}

// General format for a successful response with a user
export interface UserSuccessResponse {
   success: true;
   user: User;
   csrfToken?: string;
}

// General format for a failed response
export interface ErrorResponse {
   success: false;
   error?: string;
   csrfToken?: string;
}

export type AuthResponse = UserSuccessResponse | ErrorResponse;

export interface CheckEmailResponse {
   success: boolean;
   exists: boolean;
   message: string;
   loginWithCode: boolean;
   csrfToken?: string;
   error?: string;
}

export interface SendNewEmailCodeResponse {
   success: boolean;
   codeIsWritten: boolean;
   csrfToken?: string;
   error?: string;
}

// ===== CSRF =====

export interface CsrfResponse {
   success: boolean;
   csrfToken?: string;
}

export interface CsrfHookResult {
   csrfToken: string | null;
   loading: boolean;
   error: Error | null;
   refreshCsrfToken: () => Promise<void>;
   updateCsrfToken: (token: string | null) => void;
}
