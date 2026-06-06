import { Link } from 'react-router-dom';

import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
   return (
      <div className={styles.container}>
         <h1>404 - Page not found</h1>
         <p>
            Return to the <Link to="/">main page</Link>!
         </p>
      </div>
   );
};

export default NotFoundPage;
