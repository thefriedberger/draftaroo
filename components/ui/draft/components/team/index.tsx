import { tileColorMap } from '@/app/utils/constants';
import { DraftContext } from '@/components/context/draft-context';
import { DraftedPlayer, TeamViewProps } from '@/lib/types';
import classNames from 'classnames';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import styles from './team.module.css';

const Team = ({
   players,
   doReset = false,
   setDoReset,
   myTeam,
}: TeamViewProps) => {
   const { updateFeaturedPlayer } = useContext(DraftContext);
   const forwardCodes = ['C', 'L', 'R'];
   const [forwards, setForwards] = useState<DraftedPlayer[]>([]);
   const [defenseman, setDefenseman] = useState<DraftedPlayer[]>([]);
   const [goalies, setGoalies] = useState<DraftedPlayer[]>([]);
   const [goaliesBench, setGoaliesBench] = useState<DraftedPlayer[]>([]);
   const [bench, setBench] = useState<DraftedPlayer[]>([]);

   const setDisplayName = (player: DraftedPlayer) => {
      const displayName =
         player?.first_name !== undefined && player?.last_name !== undefined ? (
            <span
               className={classNames(
                  'min-w-40 max-w-fit',
                  'flex flex-row items-center justify-start text-black'
               )}
            >
               <Image
                  src={player.headshot ?? ''}
                  width={40}
                  height={40}
                  className="rounded-full bg-[rgba(0,0,0,.5)] mr-2"
                  alt={`Headshot of ${player?.first_name.charAt(0)}. ${
                     player?.last_name
                  }`}
               />
               <span>
                  {player?.first_name.charAt(0)}. {player?.last_name}
               </span>
            </span>
         ) : (
            ''
         );
      return displayName;
   };

   const resetPlayers = () => {
      setForwards([]);
      setDefenseman([]);
      setGoalies([]);
      setGoaliesBench([]);
      setBench([]);
   };
   useEffect(() => {
      if (doReset) {
         resetPlayers();
      }
      return () => {
         setDoReset?.(false);
      };
   }, [doReset]);

   useEffect(() => {
      if (players.length && !doReset) {
         const tempForwards: DraftedPlayer[] = [];
         const tempDefensemen: DraftedPlayer[] = [];
         const tempGoalies: DraftedPlayer[] = [];
         const tempBench: DraftedPlayer[] = [];
         const tempGoaliesBench: DraftedPlayer[] = [];

         for (const player of players.sort((a, b) => a.pick - b.pick)) {
            const { primary_position } = player;
            if (primary_position) {
               if (forwardCodes.includes(primary_position)) {
                  if (tempForwards.length < 9) {
                     tempForwards.push(player);
                  } else {
                     tempBench.push(player);
                  }
               }
               if (primary_position === 'D') {
                  if (tempDefensemen.length < 5) {
                     tempDefensemen.push(player);
                  } else {
                     tempBench.push(player);
                  }
               }
               if (primary_position === 'G') {
                  if (tempGoalies.length < 2) {
                     tempGoalies.push(player);
                  } else {
                     tempGoaliesBench.push(player);
                  }
               }
            }
         }
         setForwards(tempForwards);
         setDefenseman(tempDefensemen);
         setGoalies(tempGoalies);
         setBench(tempBench);
         setGoaliesBench(tempGoaliesBench);
      }
   }, [players]);

   // const getPlayer = (position: string, index: number) => {
   //    const playerToDisplay: Player = players.filter((player: Player) => {
   //       return player.primary_position === position;
   //    })[index];
   //    return setDisplayName(playerToDisplay);
   // };

   return (
      <div
         role="table"
         className={classNames(
            myTeam ? styles['table_team'] : styles['table'],
            'w-full rounded-md'
         )}
      >
         <div className="rounded-md text-white text-left backdrop-blur-3xl bg-[rgba(0,0,0,.5)] z-0">
            {myTeam && (
               <div
                  role="row"
                  className="hidden lg:flex w-full !border-none bg-paper-dark dark:bg-fuscia-primary px-2 py-[.35rem] !col-span-8 rounded-md mb-0.5"
               >
                  <div
                     role="columnheader"
                     aria-sort="none"
                     className="w-full !col-span-8 font-bold text-lg text-black"
                  >
                     My Roster
                  </div>
               </div>
            )}
            {!myTeam && (
               <div
                  role="row"
                  className="bg-gray-700 dark:bg-gold text-white rounded-md mb-0.5 grid grid-cols-15"
               >
                  <div
                     role="columnheader"
                     aria-sort="none"
                     className={'!col-span-2 lg:!col-span-1'}
                  >
                     Pos
                  </div>
                  <div
                     role="columnheader"
                     aria-sort="none"
                     className={'!col-span-10 lg:!col-span-12'}
                  >
                     Player
                  </div>
                  {
                     <div
                        role="columnheader"
                        aria-sort="none"
                        className={'!col-span-1'}
                     >
                        Pick
                     </div>
                  }
               </div>
            )}
         </div>
         <div role="rowgroup">
            {Array.from({ length: 9 }).map((val, index: number) => {
               const primaryPosition = forwards?.[index]?.primary_position;
               return (
                  <div
                     role="row"
                     key={forwards?.[index]?.id ?? index}
                     onClick={() => {
                        forwards?.[index] &&
                           updateFeaturedPlayer?.(forwards[index]);
                     }}
                     className={classNames(
                        tileColorMap[primaryPosition ?? 'F'].background,
                        tileColorMap[primaryPosition ?? 'F'].text,
                        forwards?.[index] && 'cursor-pointer'
                     )}
                  >
                     {' '}
                     <div role="cell" aria-sort="none">
                        <span>F</span>
                     </div>
                     <div role="cell" className={'!col-span-10 lg:col-span-11'}>
                        {forwards?.[index] && setDisplayName(forwards[index])}
                     </div>
                     {<div role="cell">{forwards?.[index]?.pick}</div>}
                  </div>
               );
            })}
            {Array.from({ length: 5 }).map((val, index: number) => {
               return (
                  <div
                     role="row"
                     key={defenseman?.[index]?.id ?? index}
                     onClick={() => {
                        defenseman?.[index] &&
                           updateFeaturedPlayer?.(defenseman[index]);
                     }}
                     className={classNames(
                        tileColorMap[
                           defenseman?.[index]?.primary_position ?? 'D'
                        ].background,
                        tileColorMap[
                           defenseman?.[index]?.primary_position ?? 'D'
                        ].text,
                        defenseman?.[index] && 'cursor-pointer'
                     )}
                  >
                     <div role="cell">
                        <span>D</span>
                     </div>
                     <div role="cell" className={'!col-span-10 lg:col-span-11'}>
                        {defenseman?.[index] &&
                           setDisplayName(defenseman[index])}
                     </div>
                     {<div role="cell">{defenseman?.[index]?.pick}</div>}
                  </div>
               );
            })}
            {bench.map((player: DraftedPlayer) => {
               return (
                  <div
                     role="row"
                     key={player.id}
                     onClick={() => updateFeaturedPlayer?.(player)}
                     className={classNames(
                        'cursor-pointer bg-[rgb(173,107,183)]'
                     )}
                  >
                     <div role="cell" className="text-black">
                        B
                     </div>
                     <div role="cell" className={'!col-span-10 lg:col-span-11'}>
                        {setDisplayName(player)}
                     </div>
                     {
                        <div role="cell" className="text-black">
                           {player.pick}
                        </div>
                     }
                  </div>
               );
            })}
            {Array.from({ length: 2 }).map((val, index: number) => {
               return (
                  <div
                     role="row"
                     key={goalies?.[index]?.id ?? index}
                     onClick={() => {
                        goalies?.[index] &&
                           updateFeaturedPlayer?.(goalies[index]);
                     }}
                     className={classNames(
                        tileColorMap[goalies?.[index]?.primary_position ?? 'G']
                           .background,
                        tileColorMap[goalies?.[index]?.primary_position ?? 'G']
                           .text,
                        goalies?.[index] && 'cursor-pointer'
                     )}
                  >
                     <div role="cell">G</div>
                     <div role="cell" className={'!col-span-10 lg:col-span-11'}>
                        {goalies?.[index] && setDisplayName(goalies[index])}
                     </div>
                     {<div role="cell">{goalies?.[index]?.pick}</div>}
                  </div>
               );
            })}
            {goaliesBench.map((player) => {
               return (
                  <div
                     role="row"
                     key={player.id}
                     onClick={() => updateFeaturedPlayer?.(player)}
                     className={classNames(
                        tileColorMap[player?.primary_position ?? 'G']
                           .background,
                        tileColorMap[player?.primary_position ?? 'G'].text,
                        player && 'cursor-pointer'
                     )}
                  >
                     <div role="cell">B</div>
                     <div role="cell" className={'!col-span-10 lg:col-span-11'}>
                        {setDisplayName(player)}
                     </div>
                     {<div role="cell">{player.pick}</div>}
                  </div>
               );
            })}
         </div>
      </div>
   );
};

export default Team;
