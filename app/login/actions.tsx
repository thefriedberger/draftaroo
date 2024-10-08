'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '../utils/supabase/server';

export async function login(formData: FormData) {
   const supabase = createClient();

   // type-casting here for convenience
   // in practice, you should validate your inputs
   const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
   };

   const {
      data: { user },
      error,
   } = await supabase.auth.signInWithPassword(data);
   if (error) {
      return error;
   }

   revalidatePath('/');
   redirect('/');
}

export async function signup(formData: FormData) {
   const supabase = createClient();

   // type-casting here for convenience
   // in practice, you should validate your inputs
   const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      options: {
         emailRedirectTo: `${formData.get('origin')}/auth/confirm`,
      },
   };
   const { error } = await supabase.auth.signUp(data);
   if (error) {
      return error;
   }

   // revalidatePath('/');
   // redirect('/');
}

export async function requestPasswordReset(formData: FormData) {
   const supabase = createClient();

   const { data, error } = await supabase.auth.resetPasswordForEmail(
      formData.get('email') as string,
      {
         redirectTo: `${formData.get('origin') as string}/auth/confirm`,
      }
   );
   if (error) {
      return false;
   }
   return true;
}
export async function resetPassword(formData: FormData) {
   const supabase = createClient();
   // type-casting here for convenience
   // in practice, you should validate your inputs
   const data = {
      password: formData.get('password') as string,
   };
   const {
      data: { user },
      error,
   } = await supabase.auth.updateUser(data);

   if (error) {
      redirect('/error');
   }

   revalidatePath('/');
   redirect('/');
}
