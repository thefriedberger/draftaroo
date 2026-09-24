const MyTeamSkeleton = () => {
   return (
      <div className="flex flex-col min-h-[55%] max-h-[55%] lg:border-r lg:border-paper-dark dark:lg:border-gray-300 overflow-y-hidden ">
         <div className="flex flex-row bg-fuscia-primary p-3 h-[35px]">
            <div className="h-full w-full bg-fuscia-dark rounded-md animate-pulse"></div>
         </div>
         {Array.from({ length: 20 }).map((v, i) => {
            return (
               <div
                  key={i}
                  className={
                     'flex flex-row border-b border-paper-dark dark:border-gray-300 p-3 text-black dark:text-white h-[35px] w-full items-center justify-center'
                  }
               >
                  <div className="h-full w-full bg-paper-dark dark:bg-gray-primary rounded-md animate-pulse"></div>
               </div>
            );
         })}
      </div>
   );
};

export default MyTeamSkeleton;
