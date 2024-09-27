import { NavMenuProps } from '@/lib/types';
import classNames from 'classnames';
import Link from 'next/link';

const NavMenu = ({
   userTeams,
   leagues,
   user,
   drafts,
   navIsOpen,
   setNavIsOpen,
}: NavMenuProps) => {
   return (
      <div
         className={classNames(
            navIsOpen && 'h-fit py-4',
            !navIsOpen && 'h-0',
            'absolute w-[100vw] overflow-hidden transition-all duration-100 left-0 top-[57px] z-50 bg-paper-primary dark:bg-gray-light'
         )}
      >
         <div className="flex flex-col mx-auto h-full max-w-full lg:max-w-4xl">
            <div className="w-full px-2">
               {userTeams?.map((team: Team, index: number) => {
                  const league: League | undefined = leagues?.find(
                     (league: League) => league.league_id === team.league_id
                  );

                  if (!league?.league_id) {
                     return;
                  }
                  const leagueDrafts =
                     drafts?.filter(
                        (draft) => draft.league_id === team.league_id
                     ) ?? [];
                  const leagueManagementLink = (
                     leagues?.filter(
                        (league: League) =>
                           league.owner === user?.id &&
                           league.league_id === team.league_id
                     ) ?? []
                  ).map((league: League) => {
                     return {
                        href: `/leagues/${league?.league_id}/league-management`,
                        text: 'Manage league',
                     };
                  });
                  const draftLinks = leagueDrafts.map((draft: Draft) => {
                     const draftLink = draft.is_completed
                        ? {
                             href: `/leagues/${team.league_id}/draft-results/${draft.id}`,
                             text: 'View draft results',
                          }
                        : {
                             href: `/leagues/${team.league_id}/draft/${draft.id}`,
                             text: 'View draft',
                          };
                     return draftLink;
                  });
                  const leagueLinks = [
                     {
                        href: `/leagues/${league.league_id}/keepers`,
                        text: 'Set keepers',
                     },
                     {
                        href: `/leagues/${league.league_id}/my-team`,
                        text: 'Change team name',
                     },
                  ];
                  if (leagueManagementLink) {
                     leagueLinks.push(...leagueManagementLink);
                  }
                  if (draftLinks) {
                     leagueLinks.push(...draftLinks);
                  }
                  return (
                     <div
                        key={index}
                        className="my-3 bg-paper-light dark:bg-gray-dark rounded-md"
                     >
                        <h3 className="pl-2 mt-2 text-xl py-2 text-white w-full bg-emerald-primary rounded-t-md">
                           {league.league_name}
                        </h3>
                        <div className={'grid grid-cols-2 lg:grid-cols-3'}>
                           {leagueLinks.map((link, k) => (
                              <Link
                                 className={
                                    'dark:text-white p-2 hover:underline decoration-emerald-primary w-fit'
                                 }
                                 href={link.href}
                                 onClick={() => setNavIsOpen(!navIsOpen)}
                                 key={`${link.text}-${k}`}
                              >
                                 {link.text}
                              </Link>
                           ))}
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      </div>
   );
};

export default NavMenu;
