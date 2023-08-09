import Tabs from '@/components/tabs';
import { Tab, TabProps } from '@/lib/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import LeaguesTab from './tabs/leagues';
import OverviewTab from './tabs/overview';

const AdminDashboard = async () => {
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

   const { email, first_name, last_name, username } = data?.[0];

   const tabs: Tab[] = [
      {
         tabButton: 'Overview',
         tabPane: <OverviewTab />,
      },
      {
         tabButton: 'Leagues',
         tabPane: <LeaguesTab />,
      },
   ];
   const tabProps: TabProps = {
      tabs,
      className: 'flex flex-col w-full lg:max-w-screen-xl text-white',
   };

   return (
      <>
         {session && (
            <>
               <h1 className="my-2 text-3xl">
                  Welcome, {first_name && first_name}
               </h1>
               <Tabs {...tabProps} />
            </>
         )}
         {!session && (
            <h1 className="text-3xl lg:max-w-">Please login to make changes</h1>
         )}
      </>
   );
};

export default AdminDashboard;
