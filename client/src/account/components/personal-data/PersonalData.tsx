import { Fragment } from 'react';
import type { User } from '@auth/authTypes';

import { genders } from '@account/userData';

import Input from '@account/components/ui/input/InputUserData';
import Selector from '@account/components/ui/selector/Selector';
import SelectorDate from '@account/components/ui/selector-date/SelectorDate';
import { SaveButton } from '@account/components/ui/button/Button';

import { usePersonalData } from '@account/hooks/usePersonalData';
import type { SelectorOption } from '@account/accountTypes';

import styles from './PersonalData.module.css';

interface UserDataProps {
   user: User | null;
   setUser: (user: User | null) => void;
}

export default function PersonalData({ user, setUser }: UserDataProps) {
   const {
      isSaving,
      formData,
      errors,
      handleInputChange,
      handleSelectorChange,
      handleSelectorDateChange,
      handleUserDataSubmit,
   } = usePersonalData({ user, setUser });

   return (
      <Fragment>
         <form noValidate>
            <div className={styles.userDataItems}>
               <div className={styles.userDataItem}>
                  <Input
                     isLabel={true}
                     name="First name"
                     type="text"
                     id="id-first-name"
                     value={formData.firstName}
                     style={undefined}
                     validationText={errors.firstName || ''}
                     onChange={(event: string) =>
                        handleInputChange(event, 'firstName')
                     }
                  />
               </div>

               <div className={styles.userDataItem}>
                  <Input
                     isLabel={true}
                     name="Last name"
                     type="text"
                     id="id-last-name"
                     value={formData.lastName}
                     validationText={errors.lastName || ''}
                     onChange={(event: string) =>
                        handleInputChange(event, 'lastName')
                     }
                  />
               </div>

               <div className={styles.userDataItem}>
                  <Input
                     isLabel={true}
                     name="Preferred name"
                     type="text"
                     id="id-preferred-name"
                     value={
                        formData.preferredName ? formData.preferredName : ''
                     }
                     validationText=""
                     onChange={(event: string) =>
                        handleInputChange(event, 'preferredName')
                     }
                  />
               </div>

               <div className={styles.userDataItem}>
                  <SelectorDate
                     label="Date of birth"
                     dateValue={formData.birthday}
                     onDateChange={handleSelectorDateChange}
                  />
               </div>

               <div className={styles.userDataItem}>
                  <Selector
                     label="Gender"
                     options={genders}
                     value={formData.gender?.id}
                     onChange={(value: SelectorOption) =>
                        handleSelectorChange(value, 'gender')
                     }
                  />
               </div>
            </div>

            <div className={styles.userDataButtonSubmit}>
               <SaveButton
                  disabled={isSaving}
                  type="submit"
                  style={{ width: '136px' }}
                  onClick={(e) => {
                     void handleUserDataSubmit(e);
                  }}
               >
                  Save
               </SaveButton>
            </div>
         </form>
      </Fragment>
   );
}
