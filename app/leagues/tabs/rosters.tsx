import getPlayers from '@/utils/get-players';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

const RostersTab = ({ league }: { league: League }) => {
   const [teams, setTeams] = useState<Team[]>([]);
   const [draftPicks, setDraftPicks] = useState<any[] | any>({});
   const [draft, setDraft] = useState<Draft | any>(null);
   const [players, setPlayers] = useState<Player[]>([]);
   const [draftedIDs, setDraftedIDs] = useState<number[]>([]);
   const [draftablePlayers, setDraftablePlayers] = useState<Player[]>([]);
   const [numberOfTeams, setNumberOfTeams] = useState<number>(0);
   const [shouldFilterPlayers, setShouldFilterPlayers] =
      useState<boolean>(false);

   const supabase = createClientComponentClient<Database>();

   const fetchLeagueTeams = async () => {
      const { data } = await supabase
         .from('teams')
         .select('*')
         .match({ league_id: league?.league_id });
      data && setTeams(data);
   };

   const fetchLeagueDraftRules = async () => {
      if (league) {
         const { data } = await supabase
            .from('league_rules')
            .select('*')
            .match({ id: league?.league_rules });

         if (data?.[0]) {
            setDraftPicks(data[0]?.draft_picks);
            data[0]?.number_of_teams &&
               setNumberOfTeams(data[0].number_of_teams);
         }
      }
   };

   const getDraft = async () => {
      if (league) {
         const { data } = await supabase
            .from('draft')
            .select('*')
            .match({ league_id: league.league_id });
         if (data?.[0]) setDraft(data?.[0]);
      }
   };

   const filterDraftedPlayers = () => {
      setPlayers(
         players.filter((player: Player) => {
            return !draftedIDs.includes(player.id);
         })
      );
      setShouldFilterPlayers(false);
   };

   const handleSetKeeper = async (
      playerID: number,
      teamID: string,
      pick: number
   ) => {
      if (draft && teamID !== '') {
         const round = Math.ceil(pick / numberOfTeams);
         const { data, error } = await supabase
            .from('draft_selections')
            .insert({
               player_id: playerID,
               team_id: teamID,
               draft_id: draft.id,
               round: round,
               pick: pick,
               is_keeper: true,
            });
         if (error) {
            console.log(error);
            return;
         } else {
            setDraftedIDs((prev) => [...prev, playerID]);
         }
      }
   };

   useEffect(() => {
      const fetchPlayers = async () => {
         if (league !== undefined) {
            const data = await getPlayers(String(league.league_id));
            setPlayers(data as Player[]);
         }
      };
      fetchPlayers();
   }, [league]);

   useEffect(() => {
      fetchLeagueTeams();
      getDraft();
      fetchLeagueDraftRules();
   }, [league]);

   useEffect(() => {
      if (players.length > 0) {
         setDraftablePlayers(
            players.filter((player: Player) => {
               return !draftedIDs.includes(player.id);
            })
         );
      }
   }, [draftedIDs, players]);

   return (
      <>
         {teams.map((team: Team, index: number) => {
            const picks = draftPicks?.[String(team.id)];
            const props = {
               picks: picks,
               team: team,
               players: draftablePlayers,
               handleSetKeeper: handleSetKeeper,
            };
            return <KeeperSelector key={index} {...props} />;
         })}
      </>
   );
};

export default RostersTab;

const KeeperSelector = ({
   picks,
   team,
   players,
   handleSetKeeper,
}: {
   picks: number[];
   team: Team;
   players: Player[];
   handleSetKeeper: (playerID: number, teamID: string, pick: number) => void;
}) => {
   const [keeper, setKeeper] = useState<number>(0);
   const [pickUsed, setPickUsed] = useState<number>(picks && picks[0]);
   const { id } = team;
   return (
      <>
         {id !== undefined && (
            <div className="flex mb-2">
               <h3>{team.team_name}</h3>
               <div className="flex flex-row">
                  <input
                     required
                     type="text"
                     list="keepers"
                     id="keeper-input"
                     onChange={(e: any) => {
                        setKeeper(e.target.value);
                     }}
                  />
                  <datalist id="keepers">
                     {players.map((player: Player) => {
                        return (
                           <option
                              key={player.id}
                              value={player.id}
                           >{`${player.first_name} ${player.last_name}`}</option>
                        );
                     })}
                  </datalist>
                  <select
                     required
                     className="dark:bg-gray-primary"
                     onChange={(e: any) => {
                        setPickUsed(e.target.value);
                     }}
                  >
                     {picks?.map((pick: number) => {
                        return (
                           <option key={pick} value={pick}>
                              {pick}
                           </option>
                        );
                     })}
                  </select>
                  <button
                     type="submit"
                     onClick={() => handleSetKeeper(keeper, id || '', pickUsed)}
                  >
                     Submit
                  </button>
               </div>
            </div>
         )}
      </>
   );
};
