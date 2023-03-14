export interface User {
    id?: string | number;
    name: string;
    email: string;
}

export interface Team {
    id: string | number;
    name: string;
    draftPosition: number;
    userID: string | number;
    leagueID: string | number;
}

export interface League {
    id: string | number;
    name: string;
    draftRules?: Array<DraftRules>;
    teamCount: number;
}

export interface Player {
    fullName: string;
    position: string;
    goals?: number;
    assists?: number;
    plusMinus?: number;
    shots?: number;
    blocks?: number;
    hits?: number;
    saves?: number;
    shotsAgainst?: number;
    goalsAgainst?: number;
    shutouts?: number;
}

export interface DraftRules {}
