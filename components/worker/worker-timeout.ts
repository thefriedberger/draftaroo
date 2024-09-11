import { useEffect, useState } from 'react';

export function useWorkerTimeout() {
   const [tick, setTick] = useState(0);
   const [running, setRunning] = useState(false);

   useEffect(() => {
      const worker = new Worker(new URL('/worker.js', import.meta.url));

      worker.onmessage = (event) => {
         if (running) {
            const workerTime = event.data;
            setTick((prev) => prev + 1);
         }
      };

      return () => worker.terminate();
   }, [running]);

   return { setRunning, tick };
}
