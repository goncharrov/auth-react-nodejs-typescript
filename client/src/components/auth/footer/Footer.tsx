import styles from './Footer.module.css';

const Footer = () => {
   return (
      <footer className={styles.footer}>
         <div className={styles.footerItems}>
            <p>© 2024 Ulubike</p>
         </div>
      </footer>
   );
};

export default Footer;
