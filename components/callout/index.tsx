import { CalloutProps } from '@/lib/types';

const Callout = (props: CalloutProps) => {
   return (
      <div className="flex flex-col p-3 text-red bg-emerald-500 rounded-xl my-3">
         <p className="mb-2">{props.calloutText}</p>
         {props.link && (
            <a
               className="bg-gray-300 rounded-xl max-w-auto p-2 transition-all hover:bg-gray-400 text-black"
               href={props.link.href}
            >
               {props.link.text}
            </a>
         )}
      </div>
   );
};
export default Callout;
