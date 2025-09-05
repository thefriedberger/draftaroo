'use client';

import { CalloutProps } from '@/lib/types';
import classNames from 'classnames';
import Link from 'next/link';

const Callout = (props: CalloutProps) => {
   const { links } = props;

   return (
      <div
         className={classNames(
            props?.classes,
            'flex flex-col p-3 text-red bg-paper-dark dark:bg-gray-light max-w-lg rounded-xl my-3'
         )}
      >
         <p className="mb-2">{props.calloutText}</p>
         {links.map((link, index) => {
            return (
               <Link
                  key={index}
                  className="bg-paper-button rounded-xl max-w-auto p-2 transition-all hover:bg-paper-light text-black mt-2"
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
