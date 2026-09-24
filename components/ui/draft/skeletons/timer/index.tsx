const TimerSkeleton = () => {
   return (
      <div className="flex flex-col justify-between w-full min-h-[90px] h-[90px] lg:overflow-hidden dark:text-white relative">
         {
            <>
               <div className="block bg-orange-primary min-h-14  text-black text-4xl p-2 text-center font-bold">
                  <div className="w-[85%] h-10 mx-auto rounded-md bg-orange-muted animate-pulse"></div>
               </div>
               <div className="block h-8 p-2">
                  <div className="h-full w-full rounded-md bg-paper-dark dark:bg-gray-primary animate-pulse"></div>
               </div>
            </>
         }
      </div>
   );
};

export default TimerSkeleton;
