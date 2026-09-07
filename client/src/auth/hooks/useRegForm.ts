import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ChangeEvent, SubmitEvent, MouseEvent } from 'react';
import type { RegUserData } from '../authTypes';

import { authApi } from '@auth/authApi';
import { isEmailValid } from '@shared/utils/formValidation';
import { useAuth } from '@auth/useAuth';

export type RegFormErrors = Partial<Record<keyof RegUserData, string>>;

export const useRegForm = () => {
   const [formData, setFormData] = useState<RegUserData>({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
   });

   const [errors, setErrors] = useState<RegFormErrors>({});
   const [loading, setLoading] = useState<boolean>(false);

   const { setUser } = useAuth();

   const navigate = useNavigate();

   const handleClickSignIn = (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      void navigate('/auth/');
   };

   const validateField = (name: keyof RegUserData, value: string) => {
      const newErrors: RegFormErrors = { ...errors };
      let isValid = false;

      if (name === 'firstName' || name === 'lastName') {
         if (value.trim() !== '') {
            isValid = true;
         }
      } else if (name === 'email') {
         if (isEmailValid(value.trim())) {
            isValid = true;
         }
      } else if (name === 'password') {
         if (value.trim().length >= 8) {
            isValid = true;
         }
      }

      if (isValid) {
         delete newErrors[name];
         setErrors(newErrors);
      }
   };

   const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = event.target;
      const fieldName = name as keyof RegUserData;

      setFormData((prev) => ({
         ...prev,
         [fieldName]: value.trim(),
      }));

      validateField(fieldName, value);
   };

   const validateFormData = (): boolean => {
      const newErrors: RegFormErrors = {};

      if (formData.firstName.trim() === '') {
         newErrors.firstName = 'Enter your first name';
      }
      if (formData.lastName.trim() === '') {
         newErrors.lastName = 'Enter your last name';
      }
      if (formData.email.trim() === '') {
         newErrors.email = 'Enter the e-mail address';
      } else {
         if (!isEmailValid(formData.email.trim())) {
            newErrors.email = 'The e-mail is incorrect';
         }
      }
      if (formData.password.trim().length < 8) {
         newErrors.password = 'Must contain at least 8 characters';
      }

      setErrors(newErrors);

      return Object.keys(newErrors).length === 0;
   };

   const handleRegSubmit = async (
      event: SubmitEvent<HTMLFormElement>
   ): Promise<void> => {
      event.preventDefault();

      if (!validateFormData()) {
         return;
      }

      setLoading(true);
      try {
         const result = await authApi.registration(formData);
         if (result.data.success) {
            setUser(result.data.user);
            void navigate('/');
         }
      } catch (err) {
         if (err instanceof Error) {
            console.log(err.message);
         } else {
            console.log(err);
         }
      } finally {
         setLoading(false);
      }
   };

   return {
      formData,
      errors,
      loading,
      handleClickSignIn,
      handleChange,
      handleRegSubmit,
   };
};
