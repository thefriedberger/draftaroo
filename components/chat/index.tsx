'use client';

import { ChatProps } from '@/lib/types';
import {
   User,
   createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

// export const UserStatus = ['sync', 'join', 'leave'] as const;
// type UserStatus = (typeof UserStatus)[number];
type ChatType = {
   message: string;
   sender: User | null;
};
const Chat = ({ user }: ChatProps) => {
   const [message, setMessage] = useState<string>();
   const [chat, setChat] = useState<ChatType[]>([]);
   const [sendMessage, setSendMessage] = useState<boolean>(false);
   const supabase = createClientComponentClient<Database>();

   const chatChannel = supabase.channel('chat-channel', {
      config: {
         broadcast: {
            self: true,
         },
      },
   });

   const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const target: any = e.target;
      target[0].value = '';
      setSendMessage(true);
   };

   useEffect(() => {
      if (user) {
         chatChannel
            .on('broadcast', { event: 'chat' }, (payload) => {
               if (payload) {
                  const newChat: ChatType = {
                     message: payload.payload.message,
                     sender: payload.payload.sender,
                  };
                  setChat((prev: ChatType[]) => [...prev, newChat]);
               }
            })
            .subscribe((channelStatus) => {
               if (channelStatus === 'SUBSCRIBED' && user && sendMessage) {
                  chatChannel.send({
                     type: 'broadcast',
                     event: 'chat',
                     payload: { message: message, sender: user },
                  });
                  setTimeout(() => {
                     setSendMessage(false);
                  }, 100);
               }
            });
      }
   }, [user, sendMessage]);
   return (
      <div className="flex flex-col h-full w-[95%] mr-1 border-2 chat-container bg-paper-primary dark:bg-gray-dark">
         <div className="h-[249px] max-h-[249px] flex flex-col overflow-y-scroll">
            {chat.map((payload: ChatType, index: number) => {
               const { message, sender } = payload;
               return (
                  <div
                     key={index}
                     className={classNames(
                        'flex flex-col p-1 w-[90%] rounded-xl m-1 ',
                        sender?.id === user?.id
                           ? 'self-end text-right pr-2 bg-emerald-primary rounded-br-none'
                           : 'bg-gray-primary rounded-bl-none pl-2'
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
         </div>
         <form
            className="flex flex-row relative mt-2 w-full"
            onSubmit={handleSendMessage}
         >
            <input
               type="text"
               placeholder="Enter message"
               className="w-full text-sm self-center p-1 min-h-[25px] pr-[30px] whitespace-nowrap"
               onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setMessage(e.target.value)
               }
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
   );
};

const AlwaysScrollToBottom = () => {
   const elementRef = useRef<any>();
   useEffect(() => elementRef.current?.scrollIntoView());
   return <div ref={elementRef} />;
};

export default Chat;
