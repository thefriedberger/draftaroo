const WatchlistSkeleton = () => {
   return (
      <div className="lg:min-h-[35vh] w-full">
         <div className="flex flex-row bg-fuscia-primary p-3 h-[35px]">
            <div className="h-full w-full bg-fuscia-dark rounded-md animate-pulse"></div>
         </div>
         <div className="h-7 p-2">
            <div className="h-full w-full rounded-md bg-paper-dark dark:bg-gray-primary animate-pulse"></div>
         </div>
      </div>
   );
};

export default WatchlistSkeleton;
