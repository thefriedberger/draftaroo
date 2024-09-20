import classNames from 'classnames';

const KeeperSkeleton = () => {
   const keeperRow = (k?: number) => {
      const rowClass =
         'h-full rounded-md animate-pulse bg-paper-dark dark:bg-gray-light lg:h-5 my-auto';
      return (
         <>
            <div className={classNames(rowClass, 'col-span-2 w-5')}></div>
            <div className={classNames(rowClass, 'col-span-2 w-5')}></div>
            <div className={classNames(rowClass, 'col-span-5 w-[85%]')}></div>
            <div className={classNames(rowClass, 'col-span-3 w-[85%]')}></div>
            <div className={classNames(rowClass, 'col-span-2 w-5')}></div>
            <div className={classNames(rowClass, 'col-span-2 w-5')}></div>
         </>
      );
   };
   return (
      <div className="flex flex-col max-h-[calc(100dvh-66px)] overflow-hidden mt-2">
         <div className="grid grid-cols-16 bg-emerald-primary min-h-16 gap-2"></div>
         {Array.from({ length: 23 }).map((v, k) => {
            return (
               <div
                  key={k}
                  className={classNames(
                     k % 2 !== 0 && 'bg-paper-primary dark:bg-gray-primary',
                     'grid grid-cols-16 min-h-12 lg:h-10 p-3 lg:p-2 gap-2'
                  )}
               >
                  {keeperRow(k)}
               </div>
            );
         })}
      </div>
   );
};

export default KeeperSkeleton;
