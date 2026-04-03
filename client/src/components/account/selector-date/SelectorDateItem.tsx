import { useRef, useState } from 'react';
import styles from './SelectorDate.module.css';
import iconArrow from '@assets/icon-arrow-16.svg';

import useClickOutside from '@hooks/useClickOutside';

type Option = {
   id: number;
   label: string;
};

type SelectorDateItemProps = {
   itemStyle: string;
   value: number | null;
   options: Option[];
   onChange: (item: Option) => void;
};

function SelectorDateItem({
   itemStyle,
   value,
   options,
   onChange,
}: SelectorDateItemProps) {
   const [isOpen, setIsOpen] = useState<boolean>(false);
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

   function handleSelect(item: Option) {
      onChange(item);
      setIsOpen(false);
   }

   const isOpenWithOptions = isOpen && options.length > 0;

   return (
      <div
         ref={selectorRef}
         className={
            isOpenWithOptions
               ? `${styles.selectorGroup} ${itemStyle} ${styles.open}`
               : `${styles.selectorGroup} ${itemStyle}`
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
               className={styles.selectorArrow}
               data-type="selector"
               alt=""
            />
         </div>

         {isOpenWithOptions && (
            <ul className={styles.selectorMenu}>
               {options.map((option) => (
                  <li key={option.id} onClick={() => handleSelect(option)}>
                     {option.label}
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}

export default SelectorDateItem;
