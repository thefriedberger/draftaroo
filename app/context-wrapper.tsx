'use client';

import { PageContext } from '@/components/context/page-context';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useContext, useEffect } from 'react';

export default function ContextWrapper({
   children,
}: {
   children: React.ReactNode;
}) {
   const { user, updateUser, session, updateSession, teams, updateTeams } =
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

   useEffect(() => {
      if (user === undefined) fetchUser();
      if (session === undefined) fetchSession();
   }, []);

   return <>{children}</>;
}
