import { AutoDraftIcon } from '@/app/assets/images/icons/auto-draft';
import { gridMap } from '@/app/utils/constants';
import { fetchAutoDraftStatusByDraft } from '@/app/utils/helpers';
import DraftOrderSkeleton from '@/components/ui/draft/skeletons/draft-order';
import { DraftOrderProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import DraftTile from '../draft-tile';
import { DraftPicksFields } from '../timer';

export type Pick = {
   playerID?: number;
   username: string;
   playerName?: string;
   draftPosition: number;
   yourPick: boolean;
   isKeeper: boolean;
};
const DraftOrder = ({
   teams,
   currentPick,
   draftedPlayers,
   isYourTurn,
   turnOrder,
   league,
   players,
   teamID,
   numberOfRounds,
   picks,
   timer,
   timerDuration,
   draftId,
}: DraftOrderProps) => {
   const supabase = createClientComponentClient<Database>();

   const gridCols = gridMap[teams.length];
   const [autoDraftTeams, setAutoDraftTeams] = useState<DraftPicksFields[]>([]);

   const draftPicks = supabase.channel(
      `public:draft_picks:draft_id=eq.${draftId}`
   );
   const subscribeToDraftPicksRoom = (
      draftId: string,
      changeCallback: (payload: any) => void
   ) => {
      draftPicks
         .on(
            'postgres_changes',
            {
               event: '*',
               schema: 'public',
               table: 'draft_picks',
               filter: `draft_id=eq.${draftId}`,
            },
            (payload) => {
               changeCallback(payload.new);
            }
         )
         .subscribe();

      return draftPicks;
   };

   const onDraftPicksChange = (payload: DraftPicksFields) => {
      const foundTeam =
         autoDraftTeams.filter((team) => team.team_id === payload.team_id) &&
         payload;
      if (foundTeam) {
         setAutoDraftTeams([
            ...autoDraftTeams.filter(
               (team) => team.team_id !== payload.team_id
            ),
            foundTeam,
         ]);
      }
   };

   const countdown = useMemo(() => {
      const width = (timer / timerDuration) * 100;
      return `${width}%`;
   }, [timer]);

   // use effects
   useEffect(() => {
      (async () => {
         const t = await fetchAutoDraftStatusByDraft(supabase, draftId);
         setAutoDraftTeams(t || []);
      })();
   }, []);

   useEffect(() => {
      subscribeToDraftPicksRoom(draftId, onDraftPicksChange);
   }, [autoDraftTeams]);

   return picks.length > 0 ? (
      <>
         <div
            className={classNames(
               gridCols,
               'w-full sticky overflow-y-scroll lg:-top-8 grid gap-2 z-10 dark:bg-gray-dark min-h-8'
            )}
         >
            {picks
               .filter((pick) => pick.draftPosition <= teams.length)
               .map((pick) => (
                  <div
                     key={pick.draftPosition}
                     className={classNames(
                        'block relative dark:text-white rounded-md text-ellipsis whitespace-nowrap overflow-hidden my-0.5'
                     )}
                  >
                     <div className="block absolute w-full h-full top-0 left-0 z-50 text-ellipsis whitespace-nowrap overflow-hidden p-0.5">
                        {pick.username}
                     </div>
                     {autoDraftTeams.find(
                        (autoDraftTeam) =>
                           autoDraftTeam.auto_draft &&
                           autoDraftTeam.picks.includes(pick.draftPosition)
                     ) ? (
                        <span
                           className={classNames(
                              currentPick % teams.length === pick.draftPosition
                                 ? 'stroke-black dark:stroke-white'
                                 : 'stroke-black dark:stroke-white',
                              'absolute top-1 right-0 z-[10000] w-7 h-7'
                           )}
                        >
                           <AutoDraftIcon />
                        </span>
                     ) : null}
                     <div
                        style={{
                           width:
                              currentPick % teams.length === pick.draftPosition
                                 ? countdown
                                 : '100%',
                           transition: 'width 1s linear',
                        }}
                        className={classNames(
                           currentPick % teams.length === pick.draftPosition &&
                              'bg-emerald-primary',
                           currentPick % teams.length === pick.draftPosition &&
                              countdown,
                           pick.yourPick &&
                              currentPick % teams.length !==
                                 pick.draftPosition &&
                              'bg-fuscia-primary !transition-none',
                           'absolute w-full h-full top-0 right-0'
                        )}
                     />
                     {/* TODO: add tooltip hover to show full team name */}
                  </div>
               ))}
         </div>
         <div
            className={classNames(
               gridCols,
               'overflow-y-scroll grid gap-2 h-full max-h-48 lg:relative lg:top-8 lg:mt-8'
            )}
         >
            {picks?.map((pick: Pick) => {
               return (
                  <DraftTile
                     key={pick.draftPosition}
                     pick={pick}
                     currentPick={currentPick}
                     playerSelected={
                        draftedPlayers[pick.playerID || 0] as DraftSelection
                     }
                     player={
                        players.find(
                           (player) => player.id === pick.playerID
                        ) as Player
                     }
                     isYourTurn={isYourTurn}
                  />
               );
            })}
         </div>
      </>
   ) : (
      <DraftOrderSkeleton />
   );
};

export default DraftOrder;
