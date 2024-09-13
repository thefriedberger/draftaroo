'use client';

import { FeaturedPlayerType } from '@/lib/types';
import React from 'react';

export type DraftContextType = {
   watchlist: number[];
   updateWatchlist?: (player: Player, action: WatchlistAction) => void;
   updateFeaturedPlayer?: (
      player: FeaturedPlayerType,
      playerID?: number
   ) => void;
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
