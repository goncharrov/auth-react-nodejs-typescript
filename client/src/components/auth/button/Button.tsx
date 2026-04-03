import styles from './Button.module.css';

type ButtonProps = {
   children: React.ReactNode;
   onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
   type?: 'button' | 'submit';
   disabled?: boolean;
};

const ButtonWhite = ({ children, onClick, type }: ButtonProps) => {
   return (
      <button
         onClick={onClick}
         className={`${styles.button} ${styles.buttonWhite}`}
         type={type}
      >
         {children}
      </button>
   );
};

const ButtonBlue = ({ children, onClick, type, disabled }: ButtonProps) => {
   return (
      <button
         onClick={onClick}
         disabled={disabled}
         className={`${styles.button} ${styles.buttonBlue}`}
         type={type}
      >
         {children}
      </button>
   );
};

export { ButtonWhite, ButtonBlue };
