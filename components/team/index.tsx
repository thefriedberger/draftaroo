import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

const Team = (props: Team) => {
   const supabase = createClientComponentClient<Database>();
   const [user, setUser] = useState<Profile>();
   const { team_name, owner } = props;

   useEffect(() => {
      const getOwner = async () => {
         const { data } = await supabase
            .from('profiles')
            .select('*')
            .match({ id: owner });
         if (data) setUser(data[0]);
      };
      if (props) getOwner();
   }, [owner]);
   return (
      <div className="">
         <p className="mr-3">{team_name}</p>
         {/* <p>{user?.first_name}</p> */}
      </div>
   );
};

export default Team;
