'use client';

import getPlayers from '@/app/utils/get-players';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export interface RosterProps {
   league: League;
   teams: Team[];
   players: Player[];
   draft: Draft;
}
const RostersTab = ({ league, teams, players, draft }: RosterProps) => {
   const [draftPicks, setDraftPicks] = useState<any[] | any>({});
   const [rosteredPlayers, setRosteredPlayers] = useState<number[]>([]);
   const [draftablePlayers, setDraftablePlayers] = useState<Player[]>([]);
   const [numberOfTeams, setNumberOfTeams] = useState<number>(0);
   const [shouldFilterPlayers, setShouldFilterPlayers] =
      useState<boolean>(false);

   const supabase = createClientComponentClient<Database>();

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

   const handleSetRoster = async (
      playerID: number,
      teamID: string,
      timesKept: number
   ) => {
      const { data: drafts, error: draft_error } = await supabase
         .from('draft')
         .select('*')
         .match({ league_id: league.league_id });
      const draftToUse: Draft = drafts
         ? drafts.filter(
              (d) => Number(d.draft_year) === new Date().getFullYear() - 1
           )[0]
         : draft;
      const { data: draft_selections } = await supabase
         .from('draft_selections')
         .select('*')
         .match({
            player_id: playerID,
            draft_id: draftToUse.id,
         });
      const round = draft_selections?.[0]?.round ?? null;
      console.log('round: ', round);
      if (teamID !== '') {
         const { data, error } = await supabase.from('team_history').upsert(
            {
               player_id: playerID,
               team_id: teamID,
               draft_position: round ?? null,
               is_keeper: false,
               times_kept: timesKept,
            },
            { onConflict: 'player_id,team_id' }
         );
         if (error) {
            console.log(error);
            return;
         } else {
            setRosteredPlayers((prev) => [...prev, playerID]);
         }
      }
   };

   useEffect(() => {
      const fetchPlayers = async () => {
         if (league !== undefined) {
            const data = await getPlayers(String(league?.league_id));
            // setPlayers(data as Player[]);
         }
      };
      fetchPlayers();
   }, [league]);

   useEffect(() => {
      fetchLeagueDraftRules();
   }, [league]);

   useEffect(() => {
      if (players && players?.length > 0) {
         setDraftablePlayers(
            players.filter((player: Player) => {
               return !rosteredPlayers.includes(player.id);
            })
         );
      }
   }, [rosteredPlayers, players]);

   return (
      <>
         {teams?.map((team: Team, index: number) => {
            const picks = draftPicks?.[String(team.id)];
            const props = {
               picks: picks,
               team: team,
               players: draftablePlayers,
               handleSetRoster: handleSetRoster,
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
   handleSetRoster,
}: {
   picks: number[];
   team: Team;
   players: Player[];
   handleSetRoster: (
      playerID: number,
      teamID: string,
      timesKept: number
   ) => void;
}) => {
   const [roster, setRoster] = useState<number>(0);
   const [pickUsed, setPickUsed] = useState<number>(picks && picks[0]);
   const [timesKept, setTimesKept] = useState<number>(0);
   const { id } = team;
   return (
      <>
         {id && (
            <div className="grid grid-cols-5 w- my-5">
               <h3 className="w-16">{team.team_name}</h3>
               <input
                  required
                  type="text"
                  list="roster"
                  id="roster-input"
                  onChange={(e: any) => {
                     setRoster(e.target.value);
                  }}
                  className={'col-span-2 mr-2'}
               />
               <datalist id="roster">
                  {players.map((player: Player) => {
                     return (
                        <option
                           key={player.id}
                           value={player.id}
                        >{`${player.first_name} ${player.last_name}`}</option>
                     );
                  })}
               </datalist>
               <div className="flex flex-col w-[88px]">
                  <label htmlFor="time-kept">Times kept:</label>
                  <input
                     type="number"
                     id="times-kept"
                     min="0"
                     defaultValue={0}
                     onChange={(e: any) => setTimesKept(e.target.value)}
                  />
               </div>
               <button
                  type="submit"
                  className="w-16"
                  onClick={() => handleSetRoster(roster, id, timesKept)}
               >
                  Submit
               </button>
            </div>
         )}
      </>
   );
};
