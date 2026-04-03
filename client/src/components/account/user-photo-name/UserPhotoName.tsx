import styles from './UserPhotoName.module.css';

import imgUser from '@assets/user-photo.jpg';
import iconArrow from '@assets/icon-arrow-16.svg';

type UserPhotoNameProps = {
   name: string;
   onClick?: () => void;
};

const UserPhotoName = ({ name, onClick }: UserPhotoNameProps) => {
   return (
      <div className={styles.userPhotoName} onClick={onClick}>
         <div className={styles.userPhotoNameContent}>
            <img src={imgUser} className={styles.imgUserPhoto} />
            <span>{name}</span>
         </div>
         <img src={iconArrow} className={styles.imgArrow} />
      </div>
   );
};

const UserPhotoNameLarge = ({ name }: UserPhotoNameProps) => {
   return (
      <div className={styles.userPhotoNameLarge}>
         <div className={styles.userPhotoNameContent}>
            <img
               src={imgUser}
               className={styles.imgUserPhoto}
               style={{ width: '56px' }}
            />
            <span className={styles.userNameLarge}>{name}</span>
         </div>
      </div>
   );
};

export { UserPhotoName, UserPhotoNameLarge };
