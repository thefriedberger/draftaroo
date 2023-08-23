const TeamView = (
   team: Team,
   {
      params,
   }: {
      params?: { id: string };
   }
) => {
   console.log(team);
   return <>{<p>{team?.team_name}</p>}</>;
};

export default TeamView;
