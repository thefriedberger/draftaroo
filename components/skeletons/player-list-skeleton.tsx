import classNames from 'classnames';

const PlayerListSkeleton = () => {
   const rowClass =
      'h-full w-full bg-paper-dark dark:bg-gray-light rounded-md animate-pulse';
   return (
      <div className="flex flex-col justify-between min-h-full w-full lg:border-r lg:border-paper-dark dark:lg:border-gray-300">
         <div className="grid grid-cols-3 lg:gap-1 lg:grid-cols-5 min-h-10 lg:min-h-8">
            <div className="h-full w-full bg-white lg:px-3 lg:py-2 p-3">
               <div className="h-full w-full bg-gray-light rounded-md animate-pulse"></div>
            </div>
            <div className="h-full w-full bg-white lg:px-3 lg:py-2 p-3">
               <div className="h-full w-full bg-gray-light rounded-md animate-pulse"></div>
            </div>
            <div className="h-full w-full bg-white lg:px-3 lg:py-2 p-3">
               <div className="h-full w-full bg-gray-light rounded-md animate-pulse"></div>
            </div>
            <div className="hidden lg:block h-full w-full bg-white lg:px-3 lg:py-2 p-3">
               <div className="h-full w-full bg-gray-light rounded-md animate-pulse"></div>
            </div>
            <div className="hidden lg:block h-full w-full bg-white lg:px-3 lg:py-2 p-3">
               <div className="h-full w-full bg-gray-light rounded-md animate-pulse"></div>
            </div>
         </div>
         <div className="flex flex-row lg:hidden bg-white p-3 min-h-10">
            <div className="h-full w-full bg-gray-light rounded-md animate-pulse"></div>
         </div>
         <div className="grid grid-cols-7 lg:grid-cols-16 gap-2 gap-x-4 bg-gold px-3 py-2 min-h-9 lg:min-h-7">
            <div></div>
            <div className="h-full w-full bg-paper-dark rounded-md animate-pulse"></div>
            <div className="col-span-2 lg:col-span-3"></div>
            <div className="h-full w-full bg-paper-dark rounded-md animate-pulse"></div>
            <div className="h-full w-full bg-paper-dark rounded-md animate-pulse"></div>
            <div className="h-full w-full bg-paper-dark rounded-md animate-pulse"></div>
            <div className="hidden lg:block h-full w-full bg-paper-dark rounded-md animate-pulse"></div>
            <div className="hidden lg:block h-full w-full bg-paper-dark rounded-md animate-pulse"></div>
            <div className="hidden lg:block h-full w-full bg-paper-dark rounded-md animate-pulse"></div>
            <div className="hidden lg:block h-full w-full bg-paper-dark rounded-md animate-pulse"></div>
            <div className="hidden lg:block h-full w-full bg-paper-dark rounded-md animate-pulse"></div>
            <div className="hidden lg:block h-full w-full bg-paper-dark rounded-md animate-pulse"></div>
            <div className="hidden lg:block h-full w-full bg-paper-dark rounded-md animate-pulse"></div>
            <div className="hidden lg:block h-full w-full bg-paper-dark rounded-md animate-pulse"></div>
         </div>
         {Array.from({ length: 50 }).map((v, k) => {
            return (
               <div
                  key={k}
                  className={classNames(
                     'flex flex-row border-b border-paper-dark dark:border-gray-300 p-3 text-black dark:text-white min-h-9 w-full items-center justify-center overflow-hidden',
                     k % 2 !== 0 && 'bg-paper-primary dark:bg-gray-primary'
                  )}
               >
                  <div className="w-full h-full grid grid-cols-7 lg:grid-cols-16 gap-2 gap-x-4">
                     <div></div>
                     <div
                        className={classNames(
                           rowClass,
                           'col-span-2 lg:col-span-3 w-[85%]'
                        )}
                     ></div>
                     <div></div>
                     <div className={classNames(rowClass)}></div>
                     <div className={classNames(rowClass)}></div>
                     <div className={classNames(rowClass)}></div>
                     <div
                        className={classNames(rowClass, 'hidden lg:block')}
                     ></div>
                     <div
                        className={classNames(rowClass, 'hidden lg:block')}
                     ></div>
                     <div
                        className={classNames(rowClass, 'hidden lg:block')}
                     ></div>
                     <div
                        className={classNames(rowClass, 'hidden lg:block')}
                     ></div>
                     <div
                        className={classNames(rowClass, 'hidden lg:block')}
                     ></div>
                     <div
                        className={classNames(rowClass, 'hidden lg:block')}
                     ></div>
                     <div
                        className={classNames(rowClass, 'hidden lg:block')}
                     ></div>
                     <div
                        className={classNames(rowClass, 'hidden lg:block')}
                     ></div>
                  </div>
               </div>
            );
         })}
      </div>
   );
};

export default PlayerListSkeleton;
