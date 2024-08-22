'use server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function LeagueLayout({
   children,
}: {
   children: ReactNode;
}) {
   const supabase = createServerComponentClient<Database>({ cookies });

   const { data, error } = await supabase.auth.getUser();
   if (error || !data?.user) {
      redirect('/');
   }

   return <>{children}</>;
}
