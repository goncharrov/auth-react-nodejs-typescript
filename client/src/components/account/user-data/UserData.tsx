import { Fragment, useState, useEffect } from 'react';
import type { MouseEvent } from 'react';

import { useAccount, type SaveUserDataRequest } from '@http/useAccountAPI';
import { genders } from '@data/userData';

import styles from './UserData.module.css';

import Input from '@components/account/input/InputUserData';
import Selector from '@components/account/selector/Selector';
import SelectorDate from '@components/account/selector-date/SelectorDate';
import { SaveButton } from '@components/account/button/Button';

import type { User } from '@type/authTypes';
import type { Gender } from '@type/accountTypes';

type SelectorOption = {
   id: string | number;
   label: string;
};

interface FormData {
   firstName: string;
   lastName: string;
   preferredName: string;
   gender: SelectorOption | null;
   birthday: Date | null;
}

interface Errors {
   [key: string]: string;
}

interface UserDataProps {
   user: User | null;
   setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function UserData({ user, setUser }: UserDataProps) {
   const [isSaving, setIsSaving] = useState<boolean>(false);
   const [formData, setFormData] = useState<FormData>({
      firstName: '',
      lastName: '',
      preferredName: '',
      gender: null,
      birthday: null,
   });

   const [errors, setErrors] = useState<Errors>({});
   const { saveUserData } = useAccount();

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

      const payload: SaveUserDataRequest = {
         firstName: formData.firstName,
         lastName: formData.lastName,
         preferredName: formData.preferredName,
         gender: formData.gender
            ? { label: formData.gender.label as Gender }
            : null,
         birthday: formData.birthday,
      };

      if (
         payload.birthday instanceof Date &&
         !isNaN(payload.birthday.getTime())
      ) {
         payload.birthday = payload.birthday.toISOString();
      }

      setIsSaving(true);
      try {
         const result = await saveUserData(payload);
         if (result.success && result.user) {
            const user = result.user;

            if (!user) {
               return;
            }

            setFormData((prevData) => ({
               ...prevData,
               firstName: user.firstName,
               lastName: user.lastName,
               preferredName: user.preferredName,
            }));

            setUser((prevUser) => ({
               ...prevUser!,
               firstName: user.firstName,
               lastName: user.lastName,
               preferredName: user.preferredName,
               gender: user.gender,
               birthday: user.birthday,
            }));
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
                     value={formData.preferredName}
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
