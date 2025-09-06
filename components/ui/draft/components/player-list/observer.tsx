import { useEffect, useRef, useState } from 'react';

const PlayerObserver = (options: IntersectionObserverInit) => {
   const [isVisible, setIsVisible] = useState<boolean>(false);
   const playersRef = useRef<HTMLTableRowElement>(null);
   const initialTableHeight = useRef<number>(0);

   useEffect(() => {
      const observer = new IntersectionObserver(loadPlayers, options);
      if (playersRef.current) {
         observer.observe(playersRef.current);
      }
   }, [playersRef]);

   const loadPlayers: IntersectionObserverCallback = (entries, observer) => {
      if (playersRef.current && initialTableHeight.current === 0) {
         initialTableHeight.current =
            playersRef.current.parentElement?.parentElement?.parentElement
               ?.offsetHeight ?? 0;
      }
      if (
         playersRef?.current?.parentElement?.parentElement?.offsetHeight &&
         playersRef?.current?.parentElement?.parentElement?.offsetHeight <
            initialTableHeight.current
      ) {
         return;
      }
      if (entries[0].isIntersecting) {
         setIsVisible(true);
      } else {
         setIsVisible(false);
      }
   };

   return { playersRef, isVisible };
};

export default PlayerObserver;
