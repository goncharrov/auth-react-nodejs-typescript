import styles from './UserDataElements.module.css';

import iconArrow from '@shared/assets/icon-arrow-16.svg';
import iconRental from '@account/assets/icon-rental-32.svg';

type RentalDataProps = {
   typeEditBtn: string;
};

const RentalData = ({ typeEditBtn }: RentalDataProps) => {
   return (
      <div className={styles.userDataElement}>
         <div className={styles.userDataValue}>
            <img src={iconRental} />
            <span>June Bali</span>
         </div>
         {typeEditBtn === 'arrow' ? (
            <img src={iconArrow} className={styles.imgArrow} />
         ) : (
            <div className={styles.userDataEdit}>
               <span>Edit</span>
            </div>
         )}
      </div>
   );
};

export default RentalData;
