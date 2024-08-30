const DraftOrderLoading = () => {
   return (
      <div className="draft-order overflow-y-scroll lg:h-full lg:border-r lg:border-paper-dark dark:lg:border-gray-300">
         {Array.from({ length: 20 }).map((v, i) => {
            return (
               <div
                  key={i}
                  className={
                     'flex flex-row border-b border-paper-dark dark:border-gray-300 p-1 cursor-pointer text-black dark:text-white'
                  }
               ></div>
            );
         })}
      </div>
   );
};

export default DraftOrderLoading;
