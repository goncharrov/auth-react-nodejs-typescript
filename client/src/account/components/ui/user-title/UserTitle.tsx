import imgUser from '@shared/assets/header/user-photo.jpg';
import iconArrow from '@shared/assets/icon-arrow-16.svg';
import styles from './UserTitle.module.css';

type UserTitleProps = {
   name: string;
   onClick?: () => void;
};

const UserTitle = ({ name, onClick }: UserTitleProps) => {
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

const UserTitleLarge = ({ name }: UserTitleProps) => {
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

export { UserTitle, UserTitleLarge };
