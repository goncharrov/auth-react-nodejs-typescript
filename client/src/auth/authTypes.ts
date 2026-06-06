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
   onBack: () => void;
   onNext: (event: MouseEvent<HTMLButtonElement>) => void;
   email: string;
   code: string;
   onCodeChange: (event: ChangeEvent<HTMLInputElement>) => void;
   onCodeSubmit: (event: MouseEvent<HTMLButtonElement>) => void;
   validationText: string;
   timerActive: boolean;
   secondsLeft: number;
   onRestart: () => Promise<void>;
   loading?: boolean;
};

export type PassFormProps = {
   onBack: () => void;
   email: string;
   password: string;
   onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
   onPasswordSubmit: (event: MouseEvent<HTMLButtonElement>) => void;
   validationText: string;
   loading: boolean;
};

// ===== Registration API types =====

export interface RegUserData {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
};

// ===== Auth API types =====

export interface User {
   email: string;
   phone: string;
   firstName: string;
   lastName: string;
   preferredName?: string;
   birthday?: string | Date;
   gender?: string;
}

// General format for a successful response with a user
export interface UserSuccessResponse {
   success: true;
   user: User;
   csrfToken?: string;
}
