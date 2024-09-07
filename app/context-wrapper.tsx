'use client';

import { PageContext } from '@/components/context/page-context';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useContext, useEffect } from 'react';

export default function ContextWrapper({
   children,
}: {
   children: React.ReactNode;
}) {
   const { user, updateUser, session, updateSession } = useContext(PageContext);

   useEffect(() => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      hashParams && getSession(hashParams);
   }, []);

   useEffect(() => {
      if (!user) fetchUser();
   }, [user]);

   const fetchUser = async () => {
      const supabase = createClientComponentClient<Database>();
      const { data: user, error } = await supabase.auth.getUser();
      if (error) {
         console.log(error);
         return;
      }
      if (user?.user) updateUser?.(user.user);
   };

   const getSession = async (hashParams: URLSearchParams) => {
      const supabase = createClientComponentClient<Database>();
      const access_token = hashParams.get('access_token') || '';
      const refresh_token = hashParams.get('refresh_token') || '';
      const { data, error } = await supabase.auth.setSession({
         access_token,
         refresh_token,
      });
      const { user, session } = data;
      user && updateUser?.(user);
      session && updateSession?.(session);
   };

   return <>{children}</>;
}
