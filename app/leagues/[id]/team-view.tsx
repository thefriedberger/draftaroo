const TeamView = (
   team: Team,
   {
      params,
   }: {
      params?: { id: string };
   }
) => {
   return <>{<p>{team?.team_name}</p>}</>;
};

export default TeamView;
