'use client';

import { FeaturedPlayerProps } from '@/lib/types';
import classNames from 'classnames';
import { useContext } from 'react';
import { PageContext } from '../context/page-context';
import { teamAbreviations } from '../player';
import WatchlistStar, { WatchlistStarProps } from '../watchlist/watchlist-star';

const FeaturedPlayer = ({
   featuredPlayer,
   yourTurn,
   handleDraftSelection,
   draftedIDs,
}: FeaturedPlayerProps) => {
   const { watchlist } = useContext(PageContext);
   const watchlistStarProps: WatchlistStarProps = {
      player: featuredPlayer as Player,
      isButton: true,
      className:
         'flex flex-row bg-gray-primary text-white fill-emerald-700 p-2 rounded-md',
   };

   const playerStats = (player: Player) => {
      return (
         <table className="text-sm mt-2">
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
                     <tr key={index}>
                        <td>
                           {season.substring(2, 4) + '-' + season.substring(6)}
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
                  );
               })}
            </tbody>
         </table>
      );
   };

   return (
      <div className="lg:h-[180px]">
         {featuredPlayer &&
            (!draftedIDs.includes(featuredPlayer.id) ? (
               <>
                  <div className="dark:text-white text-xl">
                     {featuredPlayer.first_name} {featuredPlayer.last_name}
                     &nbsp;&nbsp;&nbsp;
                     <span className="dark:text-gray-300 text-sm leading-3">
                        {teamAbreviations?.[featuredPlayer.current_team] ||
                           'FA'}{' '}
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
                           'bg-fuscia p-2 rounded-md md:mr-2 disabled:cursor-not-allowed',
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
                  {playerStats(featuredPlayer)}
                  <p>{yourTurn}</p>
               </>
            ) : (
               <>
                  <div className="dark:text-white text-xl">
                     {featuredPlayer.first_name} {featuredPlayer.last_name}
                     &nbsp;&nbsp;&nbsp;
                     <span className="dark:text-gray-300 text-sm leading-3">
                        {teamAbreviations?.[featuredPlayer.current_team] ||
                           'FA'}{' '}
                        -{' '}
                        {featuredPlayer.primary_position &&
                           featuredPlayer.primary_position
                              .split(' ')
                              .map((char: string) => char[0])}
                     </span>
                     {playerStats(featuredPlayer)}
                  </div>
               </>
            ))}
      </div>
   );
};

export default FeaturedPlayer;
