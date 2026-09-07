import { useRegForm } from '@auth/hooks/useRegForm';

import Input from '@auth/components/ui/input/Input';
import InputPassword from '@auth/components/ui/input/InputPassword';

import iconLogo from '@shared/assets/header/logo-dark.svg';

import styles from './RegForm.module.css';

const RegForm = () => {
   const {
      formData,
      errors,
      loading,
      handleClickSignIn,
      handleChange,
      handleRegSubmit,
   } = useRegForm();

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
