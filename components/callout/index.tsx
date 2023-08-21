import { CalloutProps } from '@/lib/types';
import Link from 'next/link';

const Callout = (props: CalloutProps) => {
   const { link } = props;

   return (
      <div className="flex flex-col p-3 text-red bg-emerald-500 rounded-xl my-3">
         <p className="mb-2">{props.calloutText}</p>
         {props.link && (
            <Link
               className="bg-gray-300 rounded-xl max-w-auto p-2 transition-all hover:bg-gray-400 text-black"
               href={link?.href ? link.href : '/'}
            >
               {props.link.text}
            </Link>
         )}
      </div>
   );
};
export default Callout;
