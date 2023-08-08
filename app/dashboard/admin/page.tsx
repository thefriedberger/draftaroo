import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const AdminDashboard = async () => {
   const supabase = createServerComponentClient<Database>({ cookies });
   const {
      data: { session },
   } = await supabase.auth.getSession();

   const {
      data: { user },
   } = await supabase.auth.getUser();

   return (
      <div className="text-foreground">
         {session && (
            <h1 className="text-3xl">Welcome, {user && user.email}</h1>
         )}
         {!session && (
            <h1 className="text-3xl">Please login to make changes</h1>
         )}
      </div>
   );
};

export default AdminDashboard;
