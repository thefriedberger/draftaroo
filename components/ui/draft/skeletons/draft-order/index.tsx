import classNames from 'classnames';

const DraftOrderSkeleton = () => {
   return (
      <>
         <div
            className={classNames(
               'grid-cols-6',
               'min-w-full items-start w-full grid gap-2 z-10 dark:bg-gray-dark min-h-8'
            )}
         >
            {Array.from({ length: 6 }).map((pick, i) => (
               <div
                  key={i}
                  className={classNames(
                     'block h-5 max-h-5 dark:text-white dark:bg-gray-primary animate-pulse rounded-md text-ellipsis whitespace-nowrap overflow-hidden my-0.5'
                  )}
               >
                  <div
                     className={classNames(
                        'block absolute w-full h-full top-0 left-0 z-50 text-ellipsis whitespace-nowrap overflow-hidden p-0.5'
                     )}
                  ></div>
                  <div
                     className={classNames(
                        'absolute w-full h-full top-0 right-0'
                     )}
                  />
                  {/* TODO: add tooltip hover to show full team name */}
               </div>
            ))}
         </div>
         <div
            className={classNames(
               'grid-cols-6',
               'overflow-hidden grid gap-2 h-full max-h-48'
            )}
         >
            {Array.from({ length: 12 })?.map((pick, i) => (
               <div
                  key={i}
                  className={
                     'flex flex-row border-b border-paper-dark dark:border-gray-300 p-3 text-black dark:text-white h-10 w-full items-center justify-center min-h-24 lg:max-w-full min-w-full ring-2 ring-inset ring-[rgba(0,0,0,.25)] rounded-md'
                  }
               >
                  <div className="h-full w-full bg-paper-dark dark:bg-gray-primary rounded-md animate-pulse"></div>
               </div>
            ))}
         </div>
      </>
      // <div className="flex flex-col justify-between min-h-full lg:border-r lg:border-paper-dark dark:lg:border-gray-300">
      //    {Array.from({ length: 20 }).map((v, i) => {
      //       return (
      //          <div
      //             key={i}
      //             className={
      //                'flex flex-row border-b border-paper-dark dark:border-gray-300 p-3 text-black dark:text-white h-10 w-full items-center justify-center'
      //             }
      //          >
      //             <div className="h-full w-full bg-paper-dark dark:bg-gray-primary rounded-md animate-pulse"></div>
      //          </div>
      //       );
      //    })}
      // </div>
   );
};

export default DraftOrderSkeleton;
