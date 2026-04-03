import type { ReactNode, CSSProperties, MouseEvent } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
   children: ReactNode;
   onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
   type: 'button' | 'submit';
   style: CSSProperties;
   disabled?: boolean;
};

const BlueButton = ({ children, onClick, type, style }: ButtonProps) => {
   return (
      <button
         onClick={onClick}
         type={type}
         className={styles.blueButton}
         style={style}
      >
         {children}
      </button>
   );
};

const SaveButton = ({
   children,
   onClick,
   type,
   style,
   disabled,
}: ButtonProps) => {
   return (
      <button
         onClick={onClick}
         disabled={disabled}
         type={type}
         className={styles.saveButton}
         style={style}
      >
         {children}
      </button>
   );
};

export { BlueButton, SaveButton };
