const TimerSkeleton = () => {
   return (
      <div className="flex flex-col justify-between w-full h-20 lg:min-h-[180px] lg:h-[180px] lg:overflow-hidden dark:text-white relative">
         {
            <>
               <button
                  type="button"
                  className={
                     'w-[20px] stroke-black dark:stroke-white dark:lg:stroke-black absolute top-1 right-1 z-10'
                  }
               ></button>
               <>
                  <div className="hidden lg:block bg-orange-primary min-h-14  text-black text-4xl p-2 text-center font-bold">
                     <div className="w-[85%] h-10 mx-auto rounded-md bg-orange-muted animate-pulse"></div>
                  </div>
                  <div className="hidden lg:block h-12 p-2">
                     <div className="h-full w-full rounded-md bg-paper-dark dark:bg-gray-primary animate-pulse"></div>
                  </div>
                  <div className="hidden lg:block h-6 p-2">
                     <div className="h-full w-full rounded-md bg-paper-dark dark:bg-gray-primary animate-pulse"></div>
                  </div>
                  <div className="hidden lg:block h-6 p-2">
                     <div className="h-full w-full rounded-md bg-paper-dark dark:bg-gray-primary animate-pulse"></div>
                  </div>
                  <div className="hidden lg:block h-11 p-2 bg-paper-dark dark:bg-gray-primary">
                     <div className="h-full w-full rounded-md bg-paper-primary dark:bg-gray-dark animate-pulse"></div>
                  </div>
               </>
               <div className="bg-paper-primary dark:bg-gray-primary flex flex-row lg:hidden items-center h-full">
                  <div className="flex items-center justify-center mr-2 text-xl w-[100px] bg-orange-primary min-h-full">
                     <div className="w-[85%] h-10 mx-auto rounded-md bg-orange-muted animate-pulse"></div>
                  </div>
                  <div className="flex flex-col py-2">
                     <div className="h-4 w-12 my-1 rounded-md bg-paper-dark dark:bg-gray-dark animate-pulse"></div>
                     <div className="h-4 w-9 my-1 rounded-md bg-paper-dark dark:bg-gray-dark animate-pulse"></div>
                     <div className="h-4 w-10 my-1 rounded-md bg-paper-dark dark:bg-gray-dark animate-pulse"></div>{' '}
                  </div>
                  <p className="self-end ml-auto pr-2 pb-1 text-lg"></p>
               </div>
            </>
         }
      </div>
   );
};

export default TimerSkeleton;
