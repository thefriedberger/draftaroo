import Link from 'next/link';

const TeamView = ({ team, id }: { team: Team; id: string }) => {
   return (
      <>
         {<p>{team?.team_name}</p>}
         <Link
            className={'bg-emerald-primary p-2 rounded-md mt-2'}
            href={`/leagues/${id}/draft`}
         >
            Join Draft
         </Link>
      </>
   );
};

export default TeamView;
