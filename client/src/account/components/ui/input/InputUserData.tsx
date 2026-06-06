import type { CSSProperties, InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

type InputProps = {
   isLabel: boolean;
   name: string;
   type: InputHTMLAttributes<HTMLInputElement>['type'];
   id: string;
   value: string;
   style?: CSSProperties;
   validationText: string;
   onChange: (value: string) => void;
};

const Input = (props: InputProps) => {
   const { isLabel, name, type, id, value, style, validationText, onChange } =
      props;

   return (
      <div className={styles.inputGroup}>
         {isLabel && <label htmlFor={id}>{name}</label>}
         <div className={styles.inputElement} style={style}>
            <input
               type={type}
               id={id}
               placeholder={!isLabel ? name : ''}
               autoComplete="off"
               value={value}
               onChange={(event) => onChange(event.target.value)}
            />
         </div>

         {validationText.trim() !== '' && (
            <div className={styles.validation}>
               <span>{validationText}</span>
            </div>
         )}
      </div>
   );
};

export default Input;
