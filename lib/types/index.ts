import { Pick } from '@/components/ui/draft/components/draft-order';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { AnchorHTMLAttributes, ReactNode } from 'react';

export type FeaturedPlayerType = Player | null;
export interface DraftSelections extends DraftSelection {
   first_name: string;
   last_name: string;
}

export interface NavProps {
   user?: User;
   userTeams?: Team[];
   leagues?: League[];
   drafts?: Draft[];
}

export interface NavMenuProps extends NavProps {
   navIsOpen: boolean;
   setNavIsOpen: (value: boolean) => void;
}

export interface AccountMenuProps {
   user: User;
   isOpen: boolean;
   setIsOpen: (isOpen: boolean) => void;
}

export interface BaseProps {
   title?: string;
}
export interface Link {
   href?: string;
   text?: string;
   target?: AnchorHTMLAttributes<HTMLAnchorElement>;
}

export interface CalloutLink extends Link {
   renewLeague?: boolean;
   completeDraft?: boolean;
   draftId?: string;
   leagueId?: string;
}
export interface CalloutProps {
   calloutText: string;
   links: CalloutLink[];
   classes?: string;
}

export interface DraftOrderProps {
   draftedPlayers: DraftSelection[];
   currentPick: number;
   teams: Team[] | any;
   turnOrder: DraftPick[];
   isYourTurn: boolean;
   league?: League | any;
   players: Player[];
   teamID: string;
   numberOfRounds: number;
   picks: Pick[];
   populatePicks: () => void;
}

export interface WatchlistProps {
   draftedIds: number[];
   leagueID: string;
   players: Player[];
}

export interface FeaturedPlayerProps {
   featuredPlayer: FeaturedPlayerType;
   yourTurn: boolean;
   handleDraftSelectionProps: {
      supabase: SupabaseClient;
      currentPick: number;
      currentRound: number;
      draft: Draft;
      teamId: string;
   };
   draftedIds: number[];
   isActive: boolean;
   leagueScoring: LeagueScoring;
   timerDuration: number;
}

export interface PlayerListProps {
   league: League;
   draftedIds: number[];
   players: Player[];
   leagueScoring: LeagueScoring;
}

export interface DraftTileProps {
   pick: Pick;
   currentPick: number;
   playerSelected: any;
   isYourTurn: boolean;
}

export interface ChatProps {
   user: User | null;
}

export interface DraftPick {
   team_id: string;
   draft_id: string;
   picks: number[];
}
export interface TeamProps {
   team_name: string;
   owner: string;
   league_id: string;
}

export interface UserProps {
   email: string;
   password: string;
   firstName: string;
   lastName: string;
   username: string;
   origin: string;
}

export interface Tab {
   tabButton: ReactNode | any;
   linkTab?: boolean;
   tabPane?: ReactNode | string;
}
export interface TabProps {
   tabs: Tab[];
   className?: string;
   useHash?: boolean;
   activeTabName?: string;
   tabBgColor?: string;
   text?: string;
   linkType?: string;
   link?: string;
   centerTabs?: boolean;
   saveState?: boolean;
   gridColumns?: string;
}
export interface Profile {
   firstName: string;
   lastName: string;
   email: string;
   username: string;
}

export interface ModalProps {
   buttonClass?: string;
   buttonText?: string;
}

export interface DropdownProps {
   parentText: string;
   links: ReactNode[] | Link[] | any[];
   className?: string;
}

export interface TimerProps {
   owner?: string | any;
   endTime?: string;
   currentPick: number | string;
   currentRound: number | string;
   doStart?: boolean;
   doReset?: boolean;
   setDoReset?: (val: boolean) => void;
   isActive: boolean;
   autopick: () => void;
   yourTurn: boolean;
   turnOrder: any;
   userTeam: Team;
   isCompleted: boolean;
   draftId: string;
   timerDuration: number;
   pickIsKeeper: boolean;
}

export interface BoardProps {
   league: League;
   leagueID: string;
   players: Player[];
   draft: Draft;
   draftPicks: DraftPick[];
   watchlist: watchlist;
   user: User;
   team: Team;
   teams: Team[];
   leagueRules: LeagueRules;
   leagueScoring: LeagueScoring;
   draftedPlayers: DraftSelection[];
   timerDuration: number;
}
export interface LeagueTeamViewProps {
   team: Team;
   leagueID: string;
}

export interface KeeperViewProps {
   league: League;
   team: Team;
   draft: Draft;
}

export interface DraftedPlayer extends Player {
   is_keeper: boolean;
   pick: number;
}
export interface TeamViewProps {
   players: DraftedPlayer[];
   doReset?: boolean;
   setDoReset?: (reset: boolean) => void;
}

export interface MyTeamProps {
   draftedPlayers: DraftedPlayer[];
}

export interface TeamsListProps {
   draftedPlayers: DraftedPlayer[];
   setTeamsViewPlayers: (teamID: string) => void;
   teams: Team[];
   user: User | undefined;
}

export type stats = {
   [key: string]: any;
   pim?: number;
   hits?: number;
   games?: number;
   goals?: number;
   shots?: number;
   points?: number;
   shifts?: number;
   assists?: number;
   blocked?: number;
   shotPct?: number;
   plusMinus?: number;
   timeOnIce?: number;
   faceOffPct?: number;
   evenTimeOnIce?: number;
   overTimeGoals?: number;
   penaltyMinutes?: number;
   powerPlayGoals?: number;
   powerPlayPoints?: number;
   gameWinningGoals?: number;
   shortHandedGoals?: number;
   timeOnIcePerGame?: number;
   shortHandedPoints?: number;
   powerPlayTimeOnIce?: number;
   evenTimeOnIcePerGame?: number;
   shortHandedTimeOnIce?: number;
   powerPlayTimeOnIcePerGame?: number;
   shortHandedTimeOnIcePerGame?: number;
   ot?: number;
   ties?: number;
   wins?: number;
   saves?: number;
   losses?: number;
   shutouts?: number;
   evenSaves?: number;
   evenShots?: number;
   gamesStarted?: number;
   goalsAgainst?: number;
   shotsAgainst?: number;
   powerPlaySaves?: number;
   powerPlayShots?: number;
   savePercentage?: number;
   shortHandedSaves?: number;
   shortHandedShots?: number;
   goalAgainstAverage?: number;
   powerPlaySavePercentage?: number;
   shortHandedSavePercentage?: number;
   evenStrengthSavePercentage?: number;
   score?: number;
   averageScore?: number;
};
export interface PlayerStats {
   stats?: stats;
   season?: string | number;
}

export type watchlist = Watchlist;
