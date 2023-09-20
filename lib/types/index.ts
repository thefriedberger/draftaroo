import { formStatus, formType } from '@/components/modals/auth';
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
   currentPick: number | string;
   currentRound: number | string;
   doStart: boolean;
   isActive: boolean;
}

export interface BoardProps {
   leagueID: string | any;
   draft: Draft | any;
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
