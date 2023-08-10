import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const CreateLeague = async () => {
   const supabase = createServerComponentClient<Database>({ cookies });
   const {
      data: { session },
   } = await supabase.auth.getSession();

   const {
      data: { user },
   } = await supabase.auth.getUser();

   const { data } = await supabase
      .from('profiles')
      .select('*')
      .match({ id: user?.id });

   const currentUser = data?.[0];

   return (
      <>
         {session && (
            <>
               <h1 className="my-2 text-3xl">
                  Welcome, {currentUser?.first_name && currentUser.first_name}
               </h1>
            </>
         )}
         {!session && (
            <h1 className="text-3xl lg:max-w-">Please login to make changes</h1>
         )}
      </>
   );
};

export default CreateLeague;
