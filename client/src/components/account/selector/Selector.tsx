import { Fragment, useState, useRef } from 'react';

import styles from './Selector.module.css';
import iconArrow from '@assets/icon-arrow-16.svg';

import useClickOutside from '@hooks/useClickOutside';

type SelectorOption = {
   id: string | number;
   label: string;
};

type SelectorProps = {
   label: string;
   options: SelectorOption[];
   value: SelectorOption['id'] | null | undefined;
   onChange: (item: SelectorOption) => void;
};

const Selector = ({ label, options, value, onChange }: SelectorProps) => {
   const [isOpen, setIsOpen] = useState(false);
   const selected = options.find((option) => option.id === value);
   const selectedLabel = selected ? selected.label : '';

   const selectorRef = useRef<HTMLDivElement | null>(null);

   function toggleOpen() {
      setIsOpen((prev) => !prev);
   }

   useClickOutside(selectorRef, () => {
      if (isOpen) {
         toggleOpen();
      }
   });

   function handleSelect(item: SelectorOption) {
      onChange(item);
      setIsOpen(false);
   }

   return (
      <Fragment>
         <div className={styles.selectorLabel}>{label}</div>
         <div
            ref={selectorRef}
            className={
               isOpen && options.length > 0
                  ? `${styles.selectorGroup} ${styles.open}`
                  : styles.selectorGroup
            }
         >
            <div
               className={styles.selectorField}
               data-type="selector"
               onClick={toggleOpen}
            >
               <span className={styles.selectorData} data-type="selector">
                  {selectedLabel}
               </span>
               <img
                  src={iconArrow}
                  className={
                     isOpen
                        ? `${styles.selectorArrow} ${styles.rotate}`
                        : styles.selectorArrow
                  }
                  data-type="selector"
                  alt=""
               />
            </div>
            {isOpen && options.length > 0 && (
               <ul className={styles.selectorMenu}>
                  {options.map((option) => (
                     <li key={option.id} onClick={() => handleSelect(option)}>
                        {option.label}
                     </li>
                  ))}
               </ul>
            )}
         </div>
      </Fragment>
   );
};

export default Selector;
