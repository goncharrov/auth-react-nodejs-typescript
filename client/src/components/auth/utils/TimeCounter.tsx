import styles from './TimeCounter.module.css';

type TimeCounterProps = {
   secondsLeft: number;
   onRestart: () => void;
};

const TimeCounter = ({ secondsLeft, onRestart }: TimeCounterProps) => {
   const minutes = Math.floor(secondsLeft / 60);
   const seconds = secondsLeft % 60;
   const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

   const handleClick = () => {
      if (secondsLeft === 0) {
         onRestart();
      }
   };

   return (
      <div onClick={handleClick} className={styles.codeCounter}>
         {secondsLeft > 0 && <span>{`Get a new code in ${formatted}`}</span>}
         {secondsLeft === 0 && (
            <span className={styles.getNewCode}>Get a new code</span>
         )}
      </div>
   );
};

export default TimeCounter;
