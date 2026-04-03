import styles from './ErrorModal.module.css';

type ErrorModalProps = {
   isOpen: boolean;
   onClose: () => void;
   title: string;
   reason?: string;
   explanation?: string;
   example?: string;
};

const ErrorModal = ({
   isOpen,
   onClose,
   title,
   reason,
   explanation,
   example,
}: ErrorModalProps) => {
   if (!isOpen) return null;

   return (
      <div className={styles.popUpErrorForm}>
         <div className={styles.errorFormContainer}>
            <div className={styles.errorFormContent}>
               <div className={styles.errorFormBody}>
                  <div className={styles.errorFormTitle}>
                     <span>{title}</span>
                  </div>

                  {reason && (
                     <div className={styles.errorFormReason}>
                        <span>{reason}</span>
                     </div>
                  )}

                  {explanation && (
                     <div className={styles.errorFormExplanation}>
                        <span>{explanation}</span>
                     </div>
                  )}

                  {example && (
                     <div className={styles.errorFormExample}>
                        <span>{example}</span>
                     </div>
                  )}

                  <div className={styles.errorFormOk}>
                     <button onClick={onClose}>OK</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ErrorModal;
