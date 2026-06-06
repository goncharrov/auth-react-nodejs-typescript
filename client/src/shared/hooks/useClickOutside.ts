import { useEffect } from 'react';
import type { RefObject } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

function useClickOutside<T extends HTMLElement = HTMLElement>(
   ref: RefObject<T | null>, // <T | null> вместо <T>
   handler: Handler,
   mouseEvent: 'mousedown' | 'mouseup' = 'mousedown'
): void {
   useEffect(() => {
      const listener = (event: MouseEvent | TouchEvent) => {
         if (!ref.current || ref.current.contains(event.target as Node)) {
            return;
         }
         handler(event);
      };

      document.addEventListener(mouseEvent, listener);
      return () => {
         document.removeEventListener(mouseEvent, listener);
      };
   }, [ref, handler, mouseEvent]);
}

export default useClickOutside;
