const DraftOrderSkeleton = () => {
   return (
      <div className="flex flex-col justify-between min-h-full lg:border-r lg:border-paper-dark dark:lg:border-gray-300">
         {Array.from({ length: 20 }).map((v, i) => {
            return (
               <div
                  key={i}
                  className={
                     'flex flex-row border-b border-paper-dark dark:border-gray-300 p-3 text-black dark:text-white h-10 w-full items-center justify-center animate-pulse'
                  }
               >
                  <div className="h-full w-full bg-paper-dark dark:bg-gray-primary rounded-md"></div>
               </div>
            );
         })}
      </div>
   );
};

export default DraftOrderSkeleton;
