import styles from './LoadingPage.module.css';

const LoadinPage = () => {
   return (
      <div className={styles.container}>
         <div className={styles.spinner}></div>
      </div>
   );
};

export default LoadinPage;
