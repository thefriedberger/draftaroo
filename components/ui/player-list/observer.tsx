import { useEffect, useRef, useState } from 'react';

const PlayerObserver = (options: IntersectionObserverInit) => {
   const [isVisible, setIsVisible] = useState<boolean>(false);
   const playersRef = useRef<HTMLTableRowElement | null>(null);

   useEffect(() => {
      if (playersRef.current) {
         observer.observe(playersRef.current);
      }
      //   return () => {
      //      if (playersRef.current) {
      //         observer.unobserve(playersRef.current);
      //      }
      //   };
   }, [playersRef]);

   const loadPlayers: IntersectionObserverCallback = (entries, observer) => {
      if (entries[0].isIntersecting) {
         setIsVisible(true);
      } else {
         setIsVisible(false);
      }
   };

   const observer = new IntersectionObserver(loadPlayers, options);

   return [playersRef, isVisible];
};

export default PlayerObserver;
