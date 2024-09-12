'use client';

import React from 'react';

export type DraftContextType = {
   watchlist: number[];
   updateWatchlist?: (player: Player, action: WatchlistAction) => void;
   updateFeaturedPlayer?: (player: Player | null, playerID?: number) => void;
};

const initialValues: DraftContextType = {
   watchlist: [],
};
export enum WatchlistAction {
   ADD = 'add',
   DELETE = 'delete',
}
export const DraftContext =
   React.createContext<DraftContextType>(initialValues);

export const WatchlistDispatchContext = React.createContext(null);
