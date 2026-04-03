import { useState } from 'react';
import styles from './Input.module.css';

import type { InputProps } from './InputTypes';

import iconCloseEye from '@assets/icon-close-eye.svg';
import iconEye from '@assets/icon-eye.svg';

const InputPassword = ({
   label,
   name,
   id,
   value,
   validationText = '',
   onChange,
}: InputProps) => {
   const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

   const changeInputType = () => {
      setIsPasswordVisible((isPasswordVisible) => !isPasswordVisible);
   };

   return (
      <div className={styles.inputGroup}>
         {label && <label htmlFor={id}>{label}</label>}
         <div className={styles.inputElement}>
            <input
               type={isPasswordVisible ? 'text' : 'password'}
               id={id}
               name={name}
               placeholder={!label ? label : ''}
               autoComplete="off"
               value={value}
               onChange={(event) => onChange(event)}
            />
            <div className={styles.inputElementIcon} onClick={changeInputType}>
               {!isPasswordVisible ? (
                  <img
                     src={iconCloseEye}
                     className={styles.iconCloseEye}
                     alt=""
                  />
               ) : (
                  <img src={iconEye} className={styles.iconEye} alt="" />
               )}
            </div>
         </div>
         {validationText.trim() !== '' && (
            <div className={styles.validation}>
               <span>{validationText}</span>
            </div>
         )}
      </div>
   );
};

export default InputPassword;
