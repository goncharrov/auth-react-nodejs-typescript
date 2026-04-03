import { useState } from 'react';
import type { ChangeEvent, SubmitEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './RegForm.module.css';
import iconLogo from '@assets/logo-dark.svg';

import Input from '@components/auth/input/Input';
import InputPassword from '@components/auth/input/InputPassword';

import { useAuth } from '@http/useAuthAPI';

import { isEmailValid } from '@utils/formValidation';

type RegFormData = {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
};

type RegFormErrors = Partial<Record<keyof RegFormData, string>>;

const RegForm = () => {
   const [formData, setFormData] = useState<RegFormData>({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
   });

   const [errors, setErrors] = useState<RegFormErrors>({});
   const [loading, setLoading] = useState<boolean>(false);

   const { registration } = useAuth();

   const navigate = useNavigate();

   const handleClickSignIn = (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      void navigate('/auth/');
   };

   const validateField = (name: keyof RegFormData, value: string) => {
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
      const fieldName = name as keyof RegFormData;

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
         await registration(formData);
         void navigate('/');
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

   return (
      <div className={styles.registrationForm}>
         <div className={styles.logo}>
            <a href="/">
               <img src={iconLogo} alt="Ulubike" style={{ width: '104px' }} />
            </a>
         </div>

         <p className={styles.title}>Create account</p>

         <form
            onSubmit={(e) => {
               void handleRegSubmit(e);
            }}
            noValidate
         >
            <div className={styles.doubleInputGroup}>
               <div className={styles.doubleInputElement}>
                  <Input
                     label="First name"
                     name="firstName"
                     type="text"
                     id="id-first-name"
                     value={formData.firstName}
                     validationText={errors.firstName ?? ''}
                     onChange={handleChange}
                  />
               </div>

               <div className={styles.doubleInputElement}>
                  <Input
                     label="Last name"
                     name="lastName"
                     type="text"
                     id="id-last-name"
                     value={formData.lastName}
                     validationText={errors.lastName ?? ''}
                     onChange={handleChange}
                  />
               </div>
            </div>

            <Input
               label="E-mail"
               name="email"
               type="email"
               id="id-email"
               value={formData.email}
               validationText={errors.email ?? ''}
               onChange={handleChange}
            />

            <InputPassword
               label="Password"
               id="id-password"
               name="password"
               value={formData.password}
               validationText={errors.password ?? ''}
               onChange={handleChange}
            />

            <button
               className={styles.buttonRegistration}
               type="submit"
               disabled={loading}
            >
               Continue
            </button>
         </form>

         <p style={{ fontSize: '18px' }}>or</p>

         <div className={styles.thereIsAccount}>
            <span style={{ textAlign: 'left' }}>
               Already have an account?&nbsp;
            </span>
            <div
               className={styles.switchToSignForm}
               onClick={handleClickSignIn}
            >
               Sign in
            </div>
         </div>
      </div>
   );
};

export default RegForm;
