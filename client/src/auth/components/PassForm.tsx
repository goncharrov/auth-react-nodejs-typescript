import { useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import type { PassFormProps } from '@auth/authTypes';

import InputPassword from '@auth/components/ui/input/InputPassword';
import { ButtonBlue } from '@auth/components/ui/button/Button';

import iconLogo from '@shared/assets/header/logo-dark.svg';
import iconArrow16 from '@shared/assets/icon-arrow-16.svg';

import styles from './PassForm.module.css';

const PassForm = ({
   onBack,
   email,
   password,
   onPasswordChange,
   onPasswordSubmit,
   validationText,
   loading,
}: PassFormProps) => {
   const passFormRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      if (passFormRef.current) {
         passFormRef.current.style.top = `${(window.innerHeight - 48 - 344) / 2}px`;
      }
   }, []);

   return (
      <div className={styles.passForm} ref={passFormRef}>
         <div className={styles.passLogo}>
            <div onClick={onBack} style={{ cursor: 'pointer' }}>
               <img className={styles.arrowImg} src={iconArrow16} alt="" />
            </div>
            <div>
               <NavLink to="/">
                  <img
                     src={iconLogo}
                     alt="Ulubike"
                     style={{ width: '104px' }}
                  />
               </NavLink>
            </div>
            <div style={{ width: '32px' }}></div>
         </div>

         <div className={styles.passTitle}>
            <div className={styles.passTitle1}>
               <span>Enter password to sign in to</span>
            </div>
            <div className={styles.passTitle2}>
               <span>{email}</span>
            </div>
         </div>

         <div className={styles.elements}>
            <form noValidate>
               <InputPassword
                  label=""
                  name="Enter password"
                  id="id-password"
                  value={password}
                  validationText={validationText}
                  onChange={onPasswordChange}
               />
               <ButtonBlue
                  type="submit"
                  disabled={loading}
                  onClick={onPasswordSubmit}
               >
                  Continue
               </ButtonBlue>
            </form>
         </div>
      </div>
   );
};

export default PassForm;
