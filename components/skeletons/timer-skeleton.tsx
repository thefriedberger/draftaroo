import { useMediaQuery } from 'react-responsive';

const TimerSkeleton = () => {
   const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });

   return (
      <div className="flex flex-col justify-between w-full h-[10dvh] lg:min-h-[180px] lg:h-[180px] lg:overflow-hidden dark:text-white relative animate-pulse">
         {
            <>
               <button
                  type="button"
                  className={
                     'w-[20px] stroke-black dark:stroke-white dark:lg:stroke-black absolute top-1 right-1 z-10'
                  }
               ></button>
               {!isMobile ? (
                  <>
                     <p className="bg-orange text-black text-4xl p-2 text-center font-bold"></p>
                     <p className="">{}&nbsp;Round</p>
                     <p className="">{}&nbsp;Pick</p>
                     <p className="">{}&nbsp;Overall</p>
                     <div className="p-2 bg-paper-dark dark:bg-gray-primary">
                        <p className="text-xl">{`Your turn in`}</p>
                     </div>
                  </>
               ) : (
                  <div className="bg-paper-primary dark:bg-gray-primary flex flex-row items-center h-full">
                     <div className="flex items-center justify-center mr-2 text-xl w-[100px] bg-orange min-h-full">
                        <p className="p-2 text-2xl">{}</p>
                     </div>
                     <div className="flex flex-col py-2">
                        <p className="">{}&nbsp;Round</p>
                        <p className="">{}&nbsp;Pick</p>
                        <p className="">{}&nbsp;Overall</p>
                     </div>
                     <p className="self-end ml-auto pr-2 pb-1 text-lg"></p>
                  </div>
               )}
            </>
         }
      </div>
   );
};

export default TimerSkeleton;
