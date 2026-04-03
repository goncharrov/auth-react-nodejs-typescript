import { useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './LoginForm.module.css';
import iconLogo from '@assets/logo-dark.svg';

import type { LoginFormProps } from '@type/authTypes';

import { ButtonWhite, ButtonBlue } from '@components/auth/button/Button';
import Input from '@components/auth/input/Input';

const LoginForm = ({
   onNext,
   email,
   onEmailChange,
   validationText,
   loading,
}: LoginFormProps) => {
   const loginFormRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      if (loginFormRef.current) {
         loginFormRef.current.style.top = `${(window.innerHeight - 48 - 344) / 2}px`;
      }
   }, []);

   return (
      <div className={styles.loginForm} ref={loginFormRef}>
         <NavLink to="/">
            <div className={styles.loginLogo}>
               <img src={iconLogo} alt="Ulubike" style={{ width: '104px' }} />
            </div>
         </NavLink>

         <p className={styles.loginTitle}>Sign in</p>

         <div className={styles.elements}>
            <form noValidate>
               <div className={styles.inputField}>
                  <Input
                     label=""
                     name="E-mail"
                     type="email"
                     id="id-email"
                     value={email}
                     validationText={validationText}
                     onChange={onEmailChange}
                  />
               </div>
               <ButtonBlue type="submit" disabled={loading} onClick={onNext}>
                  Continue
               </ButtonBlue>
            </form>
            <p className={styles.separatorOr}>or</p>
            <NavLink to="/auth/reg/" style={{ textDecoration: 'none' }}>
               <ButtonWhite type="button">Create an account</ButtonWhite>
            </NavLink>
         </div>
      </div>
   );
};

export default LoginForm;
