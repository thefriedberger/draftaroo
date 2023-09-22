'use client';

import { PageContext } from '@/components/context/page-context';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useContext, useEffect } from 'react';

export default function ContextWrapper({
   children,
}: {
   children: React.ReactNode;
}) {
   const { user, updateUser, session, updateSession, userTeams, updateTeam } =
      useContext(PageContext);

   const fetchUser = async () => {
      const supabase = createClientComponentClient<Database>();
      const { data: user } = await supabase.auth.getUser();
      if (user.user) updateUser?.(user.user);
   };

   const fetchSession = async () => {
      const supabase = createClientComponentClient<Database>();
      const { data: session } = await supabase.auth.getSession();
      if (session.session) updateSession?.(session.session);
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

   useEffect(() => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      hashParams !== undefined && getSession(hashParams);
   }, []);

   useEffect(() => {
      if (user === undefined) fetchUser();
      if (session === undefined) fetchSession();
   }, [user, session]);

   return <>{children}</>;
}
