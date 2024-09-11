import { useEffect, useRef, useState } from 'react';

const PlayerObserver = (options: IntersectionObserverInit) => {
   const [isVisible, setIsVisible] = useState<boolean>(false);
   const playersRef = useRef<HTMLTableRowElement | null>(null);

   useEffect(() => {
      const observer = new IntersectionObserver(loadPlayers, options);
      if (playersRef.current) {
         observer.observe(playersRef.current);
      }
   }, [playersRef]);

   const loadPlayers: IntersectionObserverCallback = (entries, observer) => {
      if (entries[0].isIntersecting) {
         setIsVisible(true);
      } else {
         setIsVisible(false);
      }
   };

   return [playersRef, isVisible];
};

export default PlayerObserver;
