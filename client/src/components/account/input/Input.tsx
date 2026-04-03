import { useState } from 'react';
import type { CSSProperties, HTMLInputTypeAttribute, ChangeEvent } from 'react';

import styles from './Input.module.css';

import iconCloseEye from '@assets/icon-close-eye.svg';
import iconEye from '@assets/icon-eye.svg';

interface InputProps {
   type?: HTMLInputTypeAttribute;
   value: string;
   style: CSSProperties;
   onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function Input(props: InputProps) {
   const { type, value, style, onChange } = props;

   return (
      <div className={styles.inputGroup}>
         <div className={styles.inputElement} style={style}>
            <input
               type={type}
               autoComplete="off"
               value={value}
               onChange={onChange}
            />
         </div>
      </div>
   );
}

function InputPassword(props: InputProps) {
   const { value, style, onChange } = props;
   const [isPasswordVisible, setIsPasswordVisible] = useState(false);

   const changeInputType = () => {
      setIsPasswordVisible((prev) => !prev);
   };

   return (
      <div className={styles.inputGroup}>
         <div className={styles.inputElement} style={style}>
            <input
               type={isPasswordVisible ? 'text' : 'password'}
               autoComplete="off"
               value={value}
               onChange={onChange}
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
      </div>
   );
}

export { Input, InputPassword };
