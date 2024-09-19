const PlayerListSkeleton = () => {
   return (
      <div className="flex flex-col justify-between min-h-full w-full lg:border-r lg:border-paper-dark dark:lg:border-gray-300">
         <div className="flex flex-row bg-white p-3 lg:px-3 lg:py-2 min-h-10 lg:min-h-7">
            <div className="h-full w-full bg-gray-light rounded-md animate-pulse"></div>
         </div>
         <div className="flex flex-row lg:hidden bg-white p-3 min-h-10">
            <div className="h-full w-full bg-gray-light rounded-md animate-pulse"></div>
         </div>
         <div className="flex flex-row bg-gold px-3 py-2 min-h-9 lg:min-h-7">
            <div className="h-full w-full bg-gray-light rounded-md animate-pulse"></div>
         </div>
         {Array.from({ length: 50 }).map((v, i) => {
            return (
               <div
                  key={i}
                  className={
                     'flex flex-row border-b border-paper-dark dark:border-gray-300 p-3 text-black dark:text-white min-h-9 w-full items-center justify-center'
                  }
               >
                  <div className="h-full w-full bg-paper-dark dark:bg-gray-primary rounded-md animate-pulse"></div>
               </div>
            );
         })}
      </div>
   );
};

export default PlayerListSkeleton;
