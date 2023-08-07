import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export default async function NewTeam() {
   const addTeam = async (formData: FormData) => {
      'use server';
      const teamName = String(formData.get('team-name'));
      const supabase = createServerActionClient<Database>({ cookies });
      await supabase.from('teams').insert([{ team_name: teamName }]);
      revalidatePath('/');
   };
   return (
      <>
         <form action={addTeam}>
            <input
               type="text"
               name="team-name"
               placeholder="team name"
               className="text-black"
            />
         </form>
      </>
   );
}
