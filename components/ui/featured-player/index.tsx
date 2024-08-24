'use client';

import FallbackImage from '@/app/assets/images/default-skater.png';
import { FeaturedPlayerProps } from '@/lib/types';
import classNames from 'classnames';
import Image from 'next/image';
import { Fragment, useState } from 'react';
import { teamAbbreviations } from '../player';
import WatchlistStar, { WatchlistStarProps } from '../watchlist/watchlist-star';

const FeaturedPlayer = ({
   featuredPlayer,
   yourTurn,
   handleDraftSelection,
   updateFeaturedPlayer,
   draftedIDs,
   updateWatchlist,
   watchlist,
}: FeaturedPlayerProps) => {
   const watchlistStarProps: WatchlistStarProps = {
      player: featuredPlayer as Player,
      updateWatchlist: updateWatchlist,
      isButton: true,
      watchlist: watchlist,
      className:
         'flex flex-row bg-paper-dark dark:bg-gray-primary text-white fill-emerald-700 p-2 rounded-md whitespace-nowrap',
   };
   const [isExpanded, setIsExpanded] = useState<boolean>(false);

   const playerStats = (player: Player) => {
      return (
         <table className="text-sm mt-2 overflow-x-scroll lg:overflow-auto max-w-[100vw] lg:max-w-auto block">
            <thead>
               <tr className="text-left bg-gold">
                  <th>Season</th>
                  <th>Score</th>
                  <th>Avg Score</th>
                  <th>GP</th>
                  <th>ATOI</th>
                  <th>G</th>
                  <th>A</th>
                  <th>+/-</th>
                  <th>PIM</th>
                  <th>PPG</th>
                  <th>PPA</th>
                  <th>SHG</th>
                  <th>SHA</th>
                  <th>SOG</th>
                  <th>HIT</th>
                  <th>BLK</th>
               </tr>
            </thead>
            <tbody>
               {player.stats?.map((seasonStats: any, index: number) => {
                  const { stats, season } = seasonStats;
                  return (
                     <Fragment key={index}>
                        {season && stats && (
                           <tr key={index}>
                              <td>
                                 {season.substring(2, 4) +
                                    '-' +
                                    season.substring(6)}
                              </td>
                              <td>{stats.score}</td>
                              <td>{stats.averageScore}</td>
                              <td>{stats.games}</td>
                              <td>{stats.timeOnIcePerGame}</td>
                              <td>{stats.goals}</td>
                              <td>{stats.assists}</td>
                              <td>{stats.plusMinus}</td>
                              <td>{stats.pim}</td>
                              <td>{stats.powerPlayGoals}</td>
                              <td>{stats.powerPlayAssists}</td>
                              <td>{stats.shortHandedGoals}</td>
                              <td>{stats.shortHandedAssists}</td>
                              <td>{stats.shots}</td>
                              <td>{stats.hits}</td>
                              <td>{stats.blocked}</td>
                           </tr>
                        )}
                     </Fragment>
                  );
               })}
            </tbody>
         </table>
      );
   };

   const statsToggle = (featuredPlayer: Player) => {
      return (
         <details className="block lg:hidden">
            <summary
               className="block lg:hidden w-fit"
               onClick={() => setIsExpanded(!isExpanded)}
            >
               <div className="bg-paper-dark text-md dark:bg-gray-primary text-black dark:text-white rounded-md p-1 mt-2 w-fit">
                  {isExpanded ? 'Hide' : 'Show'} stats
               </div>
            </summary>
            {playerStats(featuredPlayer)}
         </details>
      );
   };

   return (
      <div
         className={classNames(
            'lg:h-[210px] lg:relative fixed bottom-[66px] lg:bottom-auto bg-paper-primary dark:bg-gray-dark w-full p-2',
            isExpanded &&
               (featuredPlayer && !draftedIDs.includes(featuredPlayer.id)
                  ? 'h-[232px]'
                  : 'h-[200px]'),
            !isExpanded &&
               (featuredPlayer && !draftedIDs.includes(featuredPlayer.id)
                  ? 'h-[130px]'
                  : 'h-[90px]')
         )}
      >
         {featuredPlayer &&
            (!draftedIDs.includes(featuredPlayer.id) ? (
               <>
                  <div className={'flex flex-row'}>
                     <Image
                        src={featuredPlayer.headshot ?? FallbackImage}
                        width="100"
                        height="100"
                        className="md:mr-2"
                        alt={`${featuredPlayer.first_name} ${featuredPlayer.last_name} headshot`}
                     />
                     <div className="flex flex-col">
                        <div className="dark:text-white text-xl">
                           {featuredPlayer.first_name}{' '}
                           {featuredPlayer.last_name}
                           &nbsp;&nbsp;&nbsp;
                           <span className="dark:text-gray-300 text-sm leading-3 whitespace-nowrap">
                              {teamAbbreviations?.[
                                 featuredPlayer.current_team
                              ] || 'FA'}{' '}
                              -{' '}
                              {featuredPlayer.primary_position &&
                                 featuredPlayer.primary_position
                                    .split(' ')
                                    .map((char: string) => char[0])}
                           </span>
                        </div>
                        <div className="flex flex-row h-10">
                           <button
                              className={classNames(
                                 'bg-fuscia p-2 rounded-md mr-2 disabled:cursor-not-allowed whitespace-nowrap',
                                 !yourTurn && 'saturate-[25%]'
                              )}
                              onClick={() => {
                                 handleDraftSelection(featuredPlayer);
                              }}
                              type="button"
                              disabled={!yourTurn}
                           >
                              Draft{' '}
                              {featuredPlayer.first_name
                                 .split(' ')
                                 .map((char: string) => char[0])}
                              {'. '}
                              {featuredPlayer.last_name}
                           </button>
                           <WatchlistStar {...watchlistStarProps} />
                        </div>
                     </div>
                  </div>
                  <div className="hidden lg:block">
                     {playerStats(featuredPlayer)}
                  </div>
                  {statsToggle(featuredPlayer)}
                  <p>{yourTurn}</p>
                  <button
                     className="block lg:hidden dark:bg-dark-primary rounded-md absolute top-1 right-1"
                     type="button"
                     onClick={() => updateFeaturedPlayer(null)}
                  >
                     <svg
                        width="40px"
                        height="40px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-white"
                     >
                        <path
                           d="M9 9L15 15M15 9L9 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                  </button>
               </>
            ) : (
               <>
                  <div className={'flex flex-row'}>
                     <Image
                        src={featuredPlayer.headshot ?? FallbackImage}
                        width="100"
                        height="100"
                        className="md:mr-2"
                        alt={`${featuredPlayer.first_name} ${featuredPlayer.last_name} headshot`}
                     />
                     <div className="flex flex-col">
                        <div className="dark:text-white text-xl whitespace-nowrap">
                           {featuredPlayer.first_name}{' '}
                           {featuredPlayer.last_name}
                           &nbsp;&nbsp;&nbsp;
                           <span className="dark:text-gray-300 text-sm leading-3 whitespace-nowrap">
                              {teamAbbreviations?.[
                                 featuredPlayer.current_team
                              ] || 'FA'}{' '}
                              -{' '}
                              {featuredPlayer.primary_position &&
                                 featuredPlayer.primary_position
                                    .split(' ')
                                    .map((char: string) => char[0])}
                           </span>
                        </div>
                     </div>
                  </div>
                  <div className="hidden lg:block">
                     {playerStats(featuredPlayer)}
                  </div>
                  {statsToggle(featuredPlayer)}
                  <button
                     className="block lg:hidden absolute top-1 right-1"
                     type="button"
                     onClick={() => updateFeaturedPlayer(null)}
                  >
                     <svg
                        width="40px"
                        height="40px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-white"
                     >
                        <path
                           d="M9 9L15 15M15 9L9 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                  </button>
               </>
            ))}
      </div>
   );
};

export default FeaturedPlayer;
