'use server';
import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function LeagueLayout({
   children,
}: {
   children: ReactNode;
}) {
   const supabase = createClient();

   const { data, error } = await supabase.auth.getUser();
   if (error || !data?.user) {
      redirect('/');
   }

   return <>{children}</>;
}
