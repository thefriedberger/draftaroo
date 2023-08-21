'use client';

import { useRouter } from 'next/navigation';

export default function TeamPage({ team }: { team: any }) {
   const router = useRouter();

   const markAsComplete = async () => {
      await fetch(`http://localhost:3000/teams`, {
         method: 'put',
         body: JSON.stringify({ id: team.id, has_drafted: team.has_drafted }),
      });
      router.refresh();
   };

   return (
      <div className="flex">
         <p className="text-white mr-2">{team.name}</p>
         <button
            className="bg-white text-black rounded-sm p-1"
            onClick={markAsComplete}
         >
            {team.has_drafted ? 'True' : 'False'}
         </button>
      </div>
   );
}
