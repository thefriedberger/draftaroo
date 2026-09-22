'use client';

import { ReactNode, useEffect, useRef } from 'react';

const Modal = ({
   children,
   handleClose,
   isOpen,
}: {
   children: ReactNode;
   handleClose: () => void;
   isOpen: boolean;
}) => {
   const modalRef = useRef<HTMLDivElement>(null);
   //    const [isOpen, setIsOpen] = useState<boolean>(false);

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            isOpen && handleClose();
         }
      };

      const handleClick = (e: MouseEvent) => {
         if (!modalRef.current?.contains(e.target as Node) && isOpen) {
            handleClose();
         }
      };

      modalRef.current && modalRef.current.focus();
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
         isOpen && window.addEventListener('click', handleClick);
      }, 50);

      return () => {
         window.removeEventListener('keydown', handleKeyDown);
         window.removeEventListener('click', handleClick);
      };
   }, [modalRef, isOpen]);

   if (!children || !isOpen) return null;

   return (
      <div className="fixed top-0 left-0 w-[100vw] h-[100vh] backdrop-blur-md z-[999] overflow-hidden">
         <div
            ref={modalRef}
            autoFocus={true}
            className={
               'z-[1000] min-h-fit min-w-fit bg-paper-primary dark:bg-gray-primary text-white left-1/2 translate-x-[-50%] translate-y-[-50%] fixed top-[50%] max-w-2xl h-fit drop-shadow-xl shadow-xl rounded-md overflow-hidden'
            }
         >
            {children}
            <button
               className="absolute z-[1001] top-1 right-1"
               type="button"
               onClick={handleClose}
            >
               <svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-white w-[40px] h-[40px]"
               >
                  <path
                     d="M9 9L15 15M15 9L9 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
            </button>
         </div>
      </div>
   );
};

export default Modal;
