import { WatchlistAction } from '@/components/context/page-context';
import { Pick } from '@/components/ui/draft-order';
import { formStatus, formType } from '@/components/ui/modals/auth';
import { User } from '@supabase/supabase-js';
import { AnchorHTMLAttributes, ReactNode } from 'react';

export interface BaseProps {
   title?: string;
}
export interface Link {
   href?: string;
   text?: string;
   target?: AnchorHTMLAttributes<HTMLAnchorElement>;
}
export interface CalloutProps {
   calloutText?: string;
   links?: Link[];
}

export interface TabProps {
   text?: string;
   linkType?: string;
   link?: string;
   centerTabs?: boolean;
}
export interface DraftOrderProps {
   draftedPlayers: DraftSelection[];
   currentPick: number;
   teams: Team[] | any;
   turnOrder: any;
   isYourTurn: boolean;
   league?: League | any;
   players: Player[];
   teamID: string;
   updateFeaturedPlayer: (player: Player | any, playerID?: number) => void;
}

export interface WatchlistProps {
   updateFeaturedPlayer: (player: Player | any, playerID?: number) => void;
   draftedIDs: number[];
   leagueID: string;
   watchlist: number[];
   updateWatchlist: (player: Player, action: WatchlistAction) => void;
}

export interface FeaturedPlayerProps {
   featuredPlayer: Player | null;
   yourTurn: boolean;
   watchlist: number[];
   updateWatchlist: (player: Player, action: WatchlistAction) => void;
   handleDraftSelection: (player: Player) => void;
   updateFeaturedPlayer: (player: Player | null) => void;
   draftedIDs: number[];
}

export interface PlayerListProps {
   updateFeaturedPlayer: (player: Player | any, playerId?: number) => void;
   leagueID: string;
   draftedIDs: number[];
   players: Player[];
   watchlist: number[];
   updateWatchlist: (player: Player, action: WatchlistAction) => void;
}

export interface DraftTileProps {
   pick: Pick;
   currentPick: number;
   playerSelected: any;
   isYourTurn: boolean;
   updateFeaturedPlayer: (player: Player | any, playerID?: number) => void;
}

export interface ChatProps {
   user: User | null;
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

export interface AuthFormProps {
   setFormType: (formType: formType) => void;
   setView: (view: formStatus) => void;
}

export interface TimerProps {
   owner?: string | any;
   endTime?: string;
   currentPick: number | string;
   currentRound: number | string;
   doStart?: boolean;
   doReset: boolean;
   setDoReset: (val: boolean) => void;
   isActive: boolean;
   autopick: () => void;
   yourTurn: boolean;
   turnOrder: any;
   userTeam: Team;
   isCompleted: boolean;
}

export interface BoardProps {
   leagueID: string | any;
   draft: Draft | any;
   watchlist: watchlist;
}
export interface LeagueTeamViewProps {
   team: Team | undefined | null;
   leagueID: string;
}

export interface KeeperViewProps {
   league: League | any;
}
export interface TeamViewProps {
   players: Player[];
   doReset?: boolean;
   setDoReset?: (reset: boolean) => void;
   updateFeaturedPlayer: (player: Player | any, playerID?: number) => void;
}

export interface MyTeamProps extends TeamViewProps {
   playerIDs: number[];
}

export interface TeamsListProps extends TeamViewProps {
   playerIDs: number[];
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
   timeOnIce?: string;
   faceOffPct?: number;
   evenTimeOnIce?: string;
   overTimeGoals?: number;
   penaltyMinutes?: number;
   powerPlayGoals?: number;
   powerPlayPoints?: number;
   gameWinningGoals?: number;
   shortHandedGoals?: number;
   timeOnIcePerGame?: string;
   shortHandedPoints?: number;
   powerPlayTimeOnIce?: string;
   evenTimeOnIcePerGame?: string;
   shortHandedTimeOnIce?: string;
   powerPlayTimeOnIcePerGame?: string;
   shortHandedTimeOnIcePerGame?: string;
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

export type watchlist = Watchlist | null | undefined;
