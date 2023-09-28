'use client';

import { ChatProps } from '@/lib/types';
import {
   User,
   createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

type ChatType = {
   message: string;
   sender: User | null;
};
const Chat = ({ user }: ChatProps) => {
   const fakeUser: User = {
      id: 'sd09t8q34-fq2349ub-a90re8t0q',
      app_metadata: {},
      aud: '',
      created_at: '',
      user_metadata: {},
      email: 'faker@email.com',
   };
   const initialMessage: ChatType[] = [{ message: 'Hello', sender: fakeUser }];
   const [message, setMessage] = useState<string>();
   const [chat, setChat] = useState<ChatType[]>(initialMessage);
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
      chatChannel.subscribe((channelStatus) => {
         if (channelStatus === 'SUBSCRIBED' && user) {
            chatChannel.send({
               type: 'broadcast',
               event: 'chat',
               payload: { message: message, sender: user },
            });
         }
      });
   };

   useEffect(() => {
      if (user) {
         chatChannel.on('broadcast', { event: 'chat' }, (payload) => {
            if (payload) {
               const newChat: ChatType = {
                  message: payload.payload.message,
                  sender: payload.payload.sender,
               };
               setChat((prev: ChatType[]) => [...prev, newChat]);
            }
         });
      }
   }, [user]);
   return (
      <div className="flex flex-col h-[280px] w-[95%] mr-1 border-2 chat-container bg-paper-primary dark:bg-gray-dark">
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
                        {sender?.user_metadata.first_name || sender?.email}
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
               className="w-full text-sm self-center p-1 min-h-[25px] pr-[20px] whitespace-nowrap"
               onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setMessage(e.target.value)
               }
            />
            <button type="submit" className="absolute right-1 h-[30px]">
               {'>'}
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
