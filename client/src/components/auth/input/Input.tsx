import styles from './Input.module.css';
import type { InputProps } from './InputTypes';

const Input = ({
   label,
   name,
   type,
   id,
   value,
   validationText = '',
   onChange,
}: InputProps) => {
   return (
      <div className={styles.inputGroup}>
         {label && <label htmlFor={id}>{label}</label>}
         <div className={styles.inputElement}>
            <input
               type={type}
               id={id}
               name={name}
               placeholder={!label ? label : ''}
               autoComplete="off"
               value={value}
               onChange={onChange}
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
