const PlayerComponentSkeleton = () => {
   return (
      <tr className="my-1 min-w-full p-2">
         {Array.from({ length: 20 }).map((v, k) => (
            <td key={k} className="py-2 px-1">
               <span className="w-full h-full bg-paper-dark rounded-md animate-pulse"></span>
            </td>
         ))}
      </tr>
   );
};

export default PlayerComponentSkeleton;
