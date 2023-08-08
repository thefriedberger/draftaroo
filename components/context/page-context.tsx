'use client';

import React from 'react';

export type PageContextType = {
   prevUrl?: string;
   updatePrevUrl?: (url: string) => string;
};

const initialValues = {
   prevUrl: '',
};

interface Props {
   children: React.ReactNode;
}

export const PageContext = React.createContext<PageContextType>(initialValues);

export const PageContextProvider: React.FC<Props> = ({ children }) => {
   const [prevUrl, setPrevUrl] = React.useState<string>('');

   const updatePrevUrl = (url: string) => {
      setPrevUrl(url);
      return url;
   };
   return (
      <PageContext.Provider value={{ prevUrl, updatePrevUrl }}>
         {children}
      </PageContext.Provider>
   );
};
