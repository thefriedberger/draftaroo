import { CalloutProps } from '@/lib/types';
import Link from 'next/link';

const Callout = (props: CalloutProps) => {
   const { links } = props;

   return (
      <div className="flex flex-col p-3 text-red bg-emerald-500 rounded-xl max-w-[250px] my-3">
         <p className="mb-2">{props.calloutText}</p>
         {links?.map((link, index) => {
            return (
               <Link
                  key={index}
                  className="bg-gray-300 rounded-xl max-w-auto p-2 transition-all hover:bg-gray-400 text-black mt-2"
                  href={link?.href ? link.href : '/'}
               >
                  {link.text}
               </Link>
            );
         })}
      </div>
   );
};
export default Callout;
