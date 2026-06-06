import { Fragment, useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import type { User } from '@auth/authTypes';
import type { UserData as UserDataPayload } from '@account/accountTypes';

import { accountApi } from '@account/accountApi';

import { genders } from '@account/userData';

import Input from '@account/components/ui/input/InputUserData';
import Selector from '@account/components/ui/selector/Selector';
import SelectorDate from '@account/components/ui/selector-date/SelectorDate';
import { SaveButton } from '@account/components/ui/button/Button';

import styles from './PersonalData.module.css';

type SelectorOption = {
   id: string | number;
   label: string;
};

type FormData = Omit<User, 'email' | 'phone' | 'gender' | 'birthday'> & {
   gender: SelectorOption | null;
   birthday: Date | null;
};

interface Errors {
   [key: string]: string;
}

interface UserDataProps {
   user: User | null;
   setUser: (user: User | null) => void;
}

export default function PersonalData({ user, setUser }: UserDataProps) {
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

   return (
      <Fragment>
         <form noValidate>
            <div className={styles.userDataItems}>
               <div className={styles.userDataItem}>
                  <Input
                     isLabel={true}
                     name="First name"
                     type="text"
                     id="id-first-name"
                     value={formData.firstName}
                     style={undefined}
                     validationText={errors.firstName || ''}
                     onChange={(event: string) =>
                        handleInputChange(event, 'firstName')
                     }
                  />
               </div>

               <div className={styles.userDataItem}>
                  <Input
                     isLabel={true}
                     name="Last name"
                     type="text"
                     id="id-last-name"
                     value={formData.lastName}
                     validationText={errors.lastName || ''}
                     onChange={(event: string) =>
                        handleInputChange(event, 'lastName')
                     }
                  />
               </div>

               <div className={styles.userDataItem}>
                  <Input
                     isLabel={true}
                     name="Preferred name"
                     type="text"
                     id="id-preferred-name"
                     value={
                        formData.preferredName ? formData.preferredName : ''
                     }
                     validationText=""
                     onChange={(event: string) =>
                        handleInputChange(event, 'preferredName')
                     }
                  />
               </div>

               <div className={styles.userDataItem}>
                  <SelectorDate
                     label="Date of birth"
                     dateValue={formData.birthday}
                     onDateChange={handleSelectorDateChange}
                  />
               </div>

               <div className={styles.userDataItem}>
                  <Selector
                     label="Gender"
                     options={genders}
                     value={formData.gender?.id}
                     onChange={(value: SelectorOption) =>
                        handleSelectorChange(value, 'gender')
                     }
                  />
               </div>
            </div>

            <div className={styles.userDataButtonSubmit}>
               <SaveButton
                  disabled={isSaving}
                  type="submit"
                  style={{ width: '136px' }}
                  onClick={(e) => {
                     void handleUserDataSubmit(e);
                  }}
               >
                  Save
               </SaveButton>
            </div>
         </form>
      </Fragment>
   );
}
