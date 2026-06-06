import { useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './CodeForm.module.css';
import iconLogo from '@shared/assets/header/logo-dark.svg';
import iconArrow16 from '@shared/assets/icon-arrow-16.svg';

import type { CodeFormProps } from '../authTypes';

import { ButtonWhite, ButtonBlue } from '@auth/components/ui/button/Button';
import Input from '@auth/components/ui/input/Input';
import TimeCounter from '@auth/components/ui/time-counter/TimeCounter';

const CodeForm = ({
   onBack,
   onNext,
   email,
   code,
   onCodeChange,
   onCodeSubmit,
   validationText,
   timerActive,
   secondsLeft,
   onRestart,
   loading,
}: CodeFormProps) => {
   const codeFormRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      if (codeFormRef.current) {
         codeFormRef.current.style.top = `${(window.innerHeight - 48 - 344) / 2}px`;
      }
   }, []);

   return (
      <div className={styles.codeForm} ref={codeFormRef}>
         <div className={styles.codeLogo}>
            <div onClick={onBack} style={{ cursor: 'pointer' }}>
               <img className={styles.arrowImg} src={iconArrow16} alt="" />
            </div>
            <div>
               <NavLink to="/">
                  <img src={iconLogo} alt="Ulubike" style={{ width: '104px' }} />
               </NavLink>
            </div>
            <div style={{ width: '32px' }}></div>
         </div>

         <div className={styles.codeTitle}>
            <div className={styles.codeTitle1}>
               <span>Enter code from the message</span>
            </div>
            <div className={styles.codeTitle2}>
               <span>Sent to {email}</span>
            </div>
         </div>

         <div className={styles.elements}>
            <form noValidate>
               <Input
                  label=""
                  name="Enter code"
                  type="text"
                  id="id-code"
                  value={code}
                  validationText={validationText}
                  onChange={onCodeChange}
               />

               {timerActive && (
                  <TimeCounter secondsLeft={secondsLeft} onRestart={() => {void onRestart();}}/>
               )}

               <ButtonBlue type="submit"  disabled={loading} onClick={(e) => {void onCodeSubmit(e);}}>
                  Continue
               </ButtonBlue>
            </form>
            <p style={{ fontSize: '18px' }}>or</p>
            <ButtonWhite type="button" onClick={onNext}>
               Log in with your password
            </ButtonWhite>
         </div>
      </div>
   );
};

export default CodeForm;
