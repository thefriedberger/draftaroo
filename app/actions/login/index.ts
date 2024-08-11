'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/app/utils/supabase/server';

export async function login(formData: FormData) {
   const supabase = createClient();

   // type-casting here for convenience
   // in practice, you should validate your inputs
   const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
   };

   const { error } = await supabase.auth.signInWithPassword(data);

   revalidatePath('/');
}

export async function signup(formData: FormData) {
   const supabase = createClient();

   // type-casting here for convenience
   // in practice, you should validate your inputs
   const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
   };

   const { error } = await supabase.auth.signUp(data);

   revalidatePath('/');
}
