import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import type { User } from '@auth/authTypes';
import type { UserData as UserDataPayload, SelectorOption, FormData } from '@account/accountTypes';

import { accountApi } from '@account/accountApi';
import { genders } from '@account/userData';

export interface Errors {
   [key: string]: string;
}

interface UsePersonalDataArgs {
   user: User | null;
   setUser: (user: User | null) => void;
}

export const usePersonalData = ({ user, setUser }: UsePersonalDataArgs) => {
   const [isSaving, setIsSaving] = useState<boolean>(false);
   const [formData, setFormData] = useState<FormData>({
      firstName: '',
      lastName: '',
      preferredName: '',
      gender: null,
      birthday: null,
   });

   const [errors, setErrors] = useState<Errors>({});

   useEffect(() => {
      let userBirthday: Date | null = null;
      if (user?.birthday) {
         userBirthday = new Date(user.birthday);
      }

      setFormData({
         firstName: user?.firstName || '',
         lastName: user?.lastName || '',
         preferredName: user?.preferredName || '',
         gender: genders.find((item) => item.label === user?.gender) || null,
         birthday: userBirthday,
      });
   }, [user]);

   // ===== validation =====

   const validateField = (name: keyof FormData, value: string) => {
      const newErrors = { ...errors };
      let isValid = false;

      if (name === 'firstName' || name === 'lastName') {
         if (value.trim() !== '') {
            isValid = true;
         }
      }

      if (isValid) {
         delete newErrors[name];
         setErrors(newErrors);
      }
   };

   const validateFormData = (): boolean => {
      const newErrors: Errors = {};

      if (formData.firstName.trim() === '') {
         newErrors.firstName = 'Enter your first name';
      }
      if (formData.lastName.trim() === '') {
         newErrors.lastName = 'Enter your last name';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   // ===== handlers =====

   const handleInputChange = (value: string, name: keyof FormData) => {
      setFormData({ ...formData, [name]: value });
      validateField(name, value);
   };

   const handleSelectorChange = (
      value: SelectorOption,
      name: keyof FormData
   ) => {
      if (name === 'gender') {
         setFormData((prevData) => ({
            ...prevData,
            gender: { id: value.id, label: value.label },
         }));
      }
   };

   const handleSelectorDateChange = (newDate: Date | null) => {
      setFormData((prevData) => ({
         ...prevData,
         birthday: newDate,
      }));
   };

   // ===== save user data =====

   const handleUserDataSubmit = async (
      event: MouseEvent<HTMLButtonElement>
   ) => {
      event.preventDefault();

      if (!validateFormData()) return;

      const payload: UserDataPayload = {
         firstName: formData.firstName,
         lastName: formData.lastName,
         preferredName: formData.preferredName,
         gender: formData.gender?.label ?? undefined,
         birthday: formData.birthday ?? undefined,
      };

      if (
         payload.birthday instanceof Date &&
         !isNaN(payload.birthday.getTime())
      ) {
         payload.birthday = payload.birthday.toISOString();
      }

      setIsSaving(true);
      try {
         const result = await accountApi.saveUserData(payload);
         if (result.data.success && result.data.user) {
            const user = result.data.user;

            if (!user) {
               return;
            }

            setFormData((prevData) => ({
               ...prevData,
               firstName: user.firstName,
               lastName: user.lastName,
               preferredName: user.preferredName,
            }));

            setUser(result.data.user);
         }
      } catch (err: unknown) {
         console.error(err instanceof Error ? err.message : err);
      } finally {
         setIsSaving(false);
      }
   };

   return {
      isSaving,
      formData,
      errors,
      handleInputChange,
      handleSelectorChange,
      handleSelectorDateChange,
      handleUserDataSubmit,
   };
};
