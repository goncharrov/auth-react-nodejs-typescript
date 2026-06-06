import type { ChangeEvent, HTMLInputTypeAttribute } from 'react';

export type InputProps = {
   label?: string;
   name: string;
   type?: HTMLInputTypeAttribute;
   id: string;
   value: string;
   validationText?: string;
   onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
