'use client';

import getPlayers from '@/app/utils/get-players';
import { fetchTeamHistory, removeRosterPlayer } from '@/app/utils/helpers';
import { createClient } from '@/app/utils/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
import { ChangeEvent, useEffect, useState } from 'react';

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
   const [teamToView, setTeamToView] = useState<Team>();
   const [teamRoster, setTeamRoster] = useState<TeamHistory[]>([]);
   const [shouldFilterPlayers, setShouldFilterPlayers] =
      useState<boolean>(false);
   const [file, setFile] = useState<File>();

   const supabase = createClient();

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

   const updateTeamToView = (e: ChangeEvent<HTMLSelectElement>) => {
      setTeamToView(teams.find((team) => team.id === e.target.value));
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
      const getTeamHistory = async () => {
         if (teamToView) {
            const data = await fetchTeamHistory(supabase, teamToView);
            setTeamRoster(data);
         }
      };
      getTeamHistory();
   }, [teamToView]);

   useEffect(() => {
      if (players && players?.length > 0) {
         setDraftablePlayers(
            players.filter((player: Player) => {
               return !rosteredPlayers.includes(player.id);
            })
         );
      }
   }, [rosteredPlayers, players]);

   useEffect(() => {
      console.log(file);
   }, [file]);

   const rosterSelectorProps = {
      picks: draftPicks?.[String(teamToView?.id)] ?? [],
      team: teamToView ?? null,
      players: draftablePlayers,
      teamRoster: teamRoster,
      handleSetRoster: handleSetRoster,
      supabase: supabase,
   };
   return (
      <>
         <div className="flex flex-col mt-5">
            <label htmlFor="team-selector">Select Team: </label>
            <select
               id="team-selector"
               onChange={updateTeamToView}
               className="text-black"
            >
               <option disabled selected>
                  Select team:
               </option>
               {teams?.map((team: Team) => {
                  return (
                     <option key={team.id} value={team.id}>
                        {team.team_name}
                     </option>
                  );
               })}
            </select>
         </div>
         <KeeperSelector {...rosterSelectorProps} />
         {/* <FileSave file={file} setFile={setFile} classnames={'flex'} /> */}
      </>
   );
};

export default RostersTab;

const KeeperSelector = ({
   picks,
   team,
   players,
   teamRoster,
   handleSetRoster,
   supabase,
}: {
   picks: number[];
   team: Team | null;
   players: Player[];
   teamRoster: TeamHistory[];
   supabase: SupabaseClient;
   handleSetRoster: (
      playerID: number,
      teamID: string,
      timesKept: number
   ) => void;
}) => {
   const [roster, setRoster] = useState<number>(0);
   const [pickUsed, setPickUsed] = useState<number>(picks && picks[0]);
   const [timesKept, setTimesKept] = useState<number>(0);
   return (
      <>
         {team?.id && (
            <div className="flex flex-col w-full my-5">
               <h3>{team?.team_name}</h3>
               <h3>Current roster: </h3>
               <div className="flex flex-row flex-wrap gap-2 my-5">
                  {teamRoster.map((rosterPlayer) => {
                     const foundPlayer = players.find(
                        (player) => player.id === rosterPlayer.player_id
                     );
                     if (foundPlayer)
                        return (
                           <div
                              key={rosterPlayer.player_id}
                              className="flex min-w-60 items-center justify-between"
                           >
                              {foundPlayer?.first_name} {foundPlayer?.last_name}
                              <button
                                 type="button"
                                 className="ml-2 mr-2 rounded-full flex items-center justify-center bg-emerald-primary w-4 h-4 appearance-none"
                                 onClick={async () =>
                                    await removeRosterPlayer(
                                       supabase,
                                       foundPlayer,
                                       team
                                    )
                                 }
                              >
                                 <p className="text-center leading-[0.8] w-full h-full">
                                    -
                                 </p>
                              </button>
                           </div>
                        );
                  })}
               </div>
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
                  onClick={() => handleSetRoster(roster, team.id, timesKept)}
               >
                  Submit
               </button>
            </div>
         )}
      </>
   );
};
