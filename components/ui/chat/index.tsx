'use client';

import { ChatProps } from '@/lib/types';
import {
   User,
   createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';

// export const UserStatus = ['sync', 'join', 'leave'] as const;
// type UserStatus = (typeof UserStatus)[number];
type ChatType = {
   message: string;
   sender: User | null;
   messageType: 'chat' | 'presence';
};
const Chat = ({ user }: ChatProps) => {
   const [message, setMessage] = useState<string>();
   const [chat, setChat] = useState<ChatType[]>([]);
   const [isOpen, setIsOpen] = useState<boolean>(true);
   const [unseenMessage, setUnseenMessage] = useState<boolean>(true);
   const supabase = createClientComponentClient<Database>();

   const chatChannel = supabase.channel('chat-channel', {
      config: {
         broadcast: {
            self: true,
         },
      },
   });

   useEffect(() => {
      chatChannel
         .on('broadcast', { event: 'chat' }, (payload) => {
            if (payload) {
               const newChat: ChatType = {
                  message: payload.payload.message,
                  sender: payload.payload.sender,
                  messageType: 'chat',
               };
               if (!isOpen) {
                  setUnseenMessage(true);
               } else {
                  setUnseenMessage(false);
               }
               setChat((prev: ChatType[]) => [...prev, newChat]);
            }
         })
         .on('presence', { event: 'join' }, (payload) => {
            console.log(payload);
         })
         .subscribe((status) => {
            if (status === 'SUBSCRIBED' && message?.length && user) {
               chatChannel.send({
                  type: 'broadcast',
                  event: 'chat',
                  payload: { message: message, sender: user },
               });
               setTimeout(() => {
                  setMessage('');
               }, 100);
            }
         });
   }, [chatChannel, message]);

   useEffect(() => {
      isOpen && setUnseenMessage(false);
   }, [isOpen]);

   const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const target: any = e.target;
      setMessage(target[0].value);
      target[0].value = '';
   };
   return (
      <div
         className={classNames(
            isOpen && 'h-full max-h-[30%]',
            'hidden mt-auto min-h-[60px] self-start md:flex flex-col transition-all w-full chat-container justify-end'
         )}
      >
         <div
            className={classNames(
               isOpen && 'h-full max-h-[250px] overflow-y-scroll',

               'w-full flex flex-col rounded-t-md relative transition-all duration-150 bg-paper-primary overflow-hidden dark:bg-gray-primary pb-[35px]'
            )}
         >
            <button
               onClick={() => setIsOpen(!isOpen)}
               className={classNames(
                  'w-full flex items-center sticky top-0 min-h-6 px-2 justify-end h-6 bg-fuscia-primary hover:bg-fuscia-dark outline-none'
               )}
            >
               {unseenMessage && (
                  <span className="relative flex h-3 w-3 mr-auto">
                     <span
                        className={classNames(
                           styles['message-notification'],
                           'animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-primary opacity-75 sr-only'
                        )}
                     >
                        Close chat
                     </span>
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-primary"></span>
                  </span>
               )}
            </button>
            {chat.map((payload: ChatType, index: number) => {
               const { message, sender } = payload;
               return (
                  <div
                     key={index}
                     className={classNames(
                        'flex flex-col p-1 w-[90%] rounded-xl m-1 ',
                        sender?.id === user?.id
                           ? 'self-end text-right pr-2 bg-emerald-primary rounded-br-none'
                           : 'bg-gray-light rounded-bl-none pl-2'
                     )}
                  >
                     <p className="text-[10px] text-black dark:text-white">
                        {`${
                           sender?.user_metadata?.first_name !== undefined &&
                           sender?.user_metadata?.last_name !== undefined
                              ? sender?.user_metadata?.first_name +
                                ' ' +
                                sender?.user_metadata?.last_name
                              : sender?.email
                        }`}
                     </p>
                     <p className="text-sm text-black dark:text-white break-words">
                        {message}
                     </p>
                  </div>
               );
            })}
            <AlwaysScrollToBottom />
            <form
               className={'flex flex-row mt-2 fixed bottom-0 w-[15vw]'}
               onSubmit={handleSendMessage}
            >
               <input
                  type="text"
                  placeholder="Enter message"
                  className="w-full text-sm self-center p-1 min-h-[25px] whitespace-nowrap"
               />
               <button
                  type="submit"
                  className="absolute right-0 h-[30px] stroke-emerald-primary"
               >
                  <svg
                     width="80%"
                     height="100%"
                     viewBox="0 0 24 24"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path
                        d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     />
                  </svg>
               </button>
            </form>
         </div>
      </div>
   );
};

const AlwaysScrollToBottom = () => {
   const elementRef = useRef<any>();
   useEffect(() => elementRef.current?.scrollIntoView());
   return <div ref={elementRef} />;
};

export default Chat;
