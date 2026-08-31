'use client';

import { buildThresholdList } from '@/app/utils/helpers';
import { createClient } from '@/app/utils/supabase/client';
import PlayerObserver from '@/components/ui/draft/components/player-list/observer';
import PlayerComponentSkeleton from '@/components/ui/draft/skeletons/player-card';
import { buttonClasses } from '@/components/ui/helpers/buttons';
import { FormEvent, Suspense, useEffect, useState } from 'react';

export const PlayerList = ({
   players,
   scoring,
}: {
   players: Player[];
   scoring: LeagueScoring;
}) => {
   const [playerState, setPlayerState] = useState<Player[]>(players);

   const updateProjectedStats = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const supabase = createClient();
      const formData = new FormData(event.currentTarget);
      const formValues = Object.fromEntries(formData.entries());
      const formattedFormValues = {};

      Object.keys(formValues).map((key) => {
         if (key === 'id' || !formValues[key].length) return;
         formattedFormValues[key] = Number(formValues[key]);
      });

      const player = players.filter(
         (player) => player.id === Number(formValues['id'])
      )[0];

      const projectedKey = `${new Date().getFullYear()}${
         new Date().getFullYear() + 1
      } (proj.)`;

      let { stats } = player;

      if (!stats || Object.entries(!stats).length) {
         stats = { [projectedKey]: {} };
      }

      stats[projectedKey] = formattedFormValues;

      console.log(player);

      const { data, error } = await supabase
         .from('players')
         .upsert(player)
         .match({ id: player.id });

      console.log(data, error);
   };

   const [records, setRecords] = useState<number>(150);
   const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '50px',
      threshold: buildThresholdList,
   };

   const { playersRef, isVisible } = PlayerObserver(options);

   const filterPlayers = (event) => {
      const value = event.target.value.toLocaleLowerCase();
      if (value.length === 0) {
         setPlayerState(players);
      } else {
         setPlayerState(
            playerState.filter((player) => {
               const fullName = `${player.first_name.toLocaleLowerCase()} ${player.last_name.toLocaleLowerCase()}`;
               return fullName.includes(value);
            })
         );
      }
   };

   useEffect(() => {
      if (isVisible) setRecords(records + 150);
   }, [isVisible]);

   return (
      <>
         <input type="search" name="Filter players" onChange={filterPlayers} />
         <table className="w-full">
            <tbody>
               {playerState?.length > 0 &&
                  playerState.slice(0, records).map((player: Player) => {
                     const playerProps = {
                        player: player,
                        scoring,
                        updateProjectedStats,
                     };
                     return (
                        <Suspense
                           key={player.id}
                           fallback={<PlayerComponentSkeleton />}
                        >
                           <Player key={player.id} {...playerProps} />
                        </Suspense>
                     );
                  })}

               <tr ref={playersRef}>
                  {records >= 150 && records < playerState.length && (
                     <td>Loading...</td>
                  )}
               </tr>
            </tbody>
         </table>
      </>
   );
};

export const Player = ({
   player,
   scoring,
   updateProjectedStats,
}: {
   player: Player;
   scoring: LeagueScoring;
   updateProjectedStats: (event: FormEvent<HTMLFormElement>) => void;
}) => {
   const [isExpanded, setIsExpanded] = useState<boolean>(false);

   const projectedKey = Object.keys(player?.stats || {}).find((stat) =>
      stat.includes('proj.')
   );
   const secondaryKey = Object.keys(player?.stats || {})[
      Object.keys(player?.stats || {}).length - 2
   ];

   const playerStats =
      player.stats?.[projectedKey ?? ''] || player.stats?.[secondaryKey ?? ''];

   const skatersScore = [
      'games',
      'goals',
      'assists',
      'plusMinus',
      'shots',
      'hits',
      'blocked',
      'pim',
      'powerPlayGoals',
      'powerPlayPoints',
      'shortHandedGoals',
      'shortHandedPoints',
      'timeOnIcePerGame',
   ];
   const goalieScore = [
      'games',
      'gamesPlayed',
      'wins',
      'losses',
      'ot',
      'shotsAgainst',
      '',
      'goalsAgainst',
      'goalAgainstAverage',
      'shutouts',
   ];

   const score = Object.values(playerStats ?? {}).length
      ? playerStats
      : scoring;

   let playerScoring;

   if (player.primary_position === 'G') {
      playerScoring = goalieScore;
   } else {
      playerScoring = skatersScore;
   }

   return (
      <tr className="w-full">
         <td>
            <button onClick={() => setIsExpanded(!isExpanded)}>
               {player.first_name} {player.last_name} - {player.current_team} (
               {player.primary_position})
            </button>
            <form
               className={
                  isExpanded ? 'h-fit z-100' : 'hidden h-0 overflow-hidden'
               }
               onSubmit={updateProjectedStats}
            >
               <div className="grid grid-cols-4 gap-4 mb-2">
                  {playerScoring
                     .filter(
                        (category: string) =>
                           !['score', 'averageScore'].includes(category)
                     )
                     .map((category: string) => {
                        const cat = `${category
                           .charAt(0)
                           .toLocaleUpperCase()}${category.substring(
                           1,
                           category.length
                        )}`;
                        const stringifiedCategory = cat
                           .split(/(?=[A-Z])/)
                           .join(' ');

                        return (
                           <div key={category} className="flex flex-col">
                              <label htmlFor={category}>
                                 {stringifiedCategory}
                              </label>
                              <input
                                 id={category}
                                 name={category}
                                 type="number"
                              />
                           </div>
                        );
                     })}
               </div>
               <input
                  type="text"
                  name="id"
                  value={player.id}
                  className="hidden"
               />
               <button type="submit" className={buttonClasses}>
                  Submit
               </button>
            </form>
         </td>
      </tr>
   );
};
