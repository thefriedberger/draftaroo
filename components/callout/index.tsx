import { CalloutProps } from '@/lib/types';

const Callout = (props: CalloutProps) => {
   return (
      <div className="flex flex-col p-3 text-red bg-emerald-500 rounded-xl">
         <p>{props.calloutText}</p>
         {props.link && (
            <a
               className="bg-gray-300 rounded-sm text-black"
               href={props.link.href}
            >
               {props.link.text}
            </a>
         )}
      </div>
   );
};
export default Callout;
