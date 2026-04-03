import { Fragment, useMemo, useState } from 'react';

import styles from './SelectorDate.module.css';

import SelectorDateItem from '@components/account/selector-date/SelectorDateItem';

import { months, type MonthOption } from '@data/userData';

type Option = {
   id: number;
   label: string;
};

type SelectorDateProps = {
   label: string;
   dateValue: Date | string | null;
   onDateChange: (date: Date) => void;
};

type OptionsState = {
   days: Option[];
   months: MonthOption[];
   years: Option[];
};

function getListDaysInMonth(date?: Date | null): Option[] {
   if (!date) {
      date = new Date();
   }

   const month = date.getMonth();
   const year = date.getFullYear();
   const days = new Date(year, month + 1, 0).getDate();

   const list: Option[] = [];
   for (let i = 1; i <= days; i++) {
      list.push({ label: String(i), id: i });
   }
   return list;
}

function getListYears(): Option[] {
   const lastYear = new Date().getFullYear() - 16;
   const list: Option[] = [];

   for (let i = lastYear; i >= 1901; i--) {
      list.push({ label: String(i), id: i });
   }
   return list;
}

function SelectorDate({ label, dateValue, onDateChange }: SelectorDateProps) {
   const [day, setDay] = useState<number | null>(null);
   const [month, setMonth] = useState<number | null>(null);
   const [year, setYear] = useState<number | null>(null);

   const [prevDateValue, setPrevDateValue] = useState<
      Date | string | null | undefined
   >(undefined);

   if (dateValue !== prevDateValue) {
      setPrevDateValue(dateValue);
      if (dateValue !== null) {
         const $date = new Date(dateValue);
         if (!isNaN($date.getTime())) {
            setDay($date.getDate());
            const monthOption = months.find(
               (item: MonthOption) => item.id === $date.getMonth()
            );
            if (monthOption) {
               setMonth(monthOption.id);
            }
            setYear($date.getFullYear());
         }
      }
   }

   const baseDateForLists = useMemo(() => {
      if (dateValue === null) {
         return new Date();
      }
      const $date = new Date(dateValue);
      return isNaN($date.getTime()) ? new Date() : $date;
   }, [dateValue]);

   const yearsOptions = useMemo(() => getListYears(), []);

   const options: OptionsState = useMemo(() => {
      const daysSourceDate =
         year !== null && month !== null
            ? new Date(year, month, 1)
            : baseDateForLists;
      return {
         days: getListDaysInMonth(daysSourceDate),
         months,
         years: yearsOptions,
      };
   }, [year, month, baseDateForLists, yearsOptions]);

   const handleSelectorChange = (
      value: Option,
      name: 'day' | 'month' | 'year'
   ) => {
      if (name === 'day') {
         const found = options.days.find((item) => item.id === value.id);
         if (found) {
            setDay(found.id);
            if (month !== null && year !== null) {
               const newDate = new Date(year, month, found.id);
               if (!isNaN(newDate.getTime())) {
                  onDateChange(newDate);
               }
            }
         }
      } else if (name === 'month') {
         const found = options.months.find((item) => item.id === value.id);
         if (found) {
            setMonth(found.id);
            if (value.id >= 0 && year !== null && year > 0) {
               const daysList = getListDaysInMonth(new Date(year, value.id, 1));
               if (day !== null && !daysList.some((item) => item.id === day)) {
                  setDay(null);
                  return;
               }
            }
            if (day !== null && year !== null) {
               const newDate = new Date(year, found.id, day);
               if (!isNaN(newDate.getTime())) {
                  onDateChange(newDate);
               }
            }
         }
      } else if (name === 'year') {
         const found = options.years.find((item) => item.id === value.id);
         if (found) {
            setYear(found.id);
            if (month !== null && month >= 0 && value.id > 0) {
               const daysList = getListDaysInMonth(
                  new Date(value.id, month, 1)
               );
               if (day !== null && !daysList.some((item) => item.id === day)) {
                  setDay(null);
                  return;
               }
            }
            if (day !== null && month !== null) {
               const newDate = new Date(found.id, month, day);
               if (!isNaN(newDate.getTime())) {
                  onDateChange(newDate);
               }
            }
         }
      }
   };

   return (
      <Fragment>
         <div className={styles.selectorLabel}>{label}</div>
         <div className={styles.dateOfBirth}>
            <SelectorDateItem
               itemStyle={styles.birthDate}
               value={day}
               options={options.days}
               onChange={(value) => handleSelectorChange(value, 'day')}
            />
            <SelectorDateItem
               itemStyle={styles.birthMonth}
               value={month}
               options={options.months}
               onChange={(value) => handleSelectorChange(value, 'month')}
            />
            <SelectorDateItem
               itemStyle={styles.birthYear}
               value={year}
               options={options.years}
               onChange={(value) => handleSelectorChange(value, 'year')}
            />
         </div>
      </Fragment>
   );
}

export default SelectorDate;
