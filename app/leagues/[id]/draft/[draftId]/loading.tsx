export default function Loading() {
   return (
      <div className="flex items-center dark:text-white ">
         <h1 className="my-5">Loading draft</h1>
         <div className="ml-1 text-xl animate-bounce-1">.</div>
         <div className="text-xl animate-bounce-1.5">.</div>
         <div className="text-xl animate-bounce-2">.</div>
      </div>
   );
}
