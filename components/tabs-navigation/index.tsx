'use client';

import { TabProps } from '@/lib/types';
import classNames from 'classnames';
import { useState } from 'react';
import styles from './tabs.module.css';

const TabsNavigation = ({
   tabs,
   activeTabName,
   centerTabs,
   className,
   link,
   linkType,
   tabBgColor,
   text,
   useHash,
}: TabProps) => {
   const [activeTabIndex, setActiveTabIndex] = useState(0);

   const navList = () =>
      tabs.map((tab, index) => {
         const key = typeof tab.tabButton === 'string' ? tab.tabButton : index;
         const isActive = index === activeTabIndex;
         return (
            <li
               key={key}
               className={classNames(
                  isActive && styles['nav-active'],
                  'h-[66px] inline-flex lg:h-auto p-2 text-center items-end justify-center border-r-2 border-r-emerald-600 last-of-type:border-none'
               )}
            >
               <button
                  onClick={(e) => {
                     e.preventDefault();
                     setActiveTabIndex(index);
                  }}
                  className={classNames(
                     'text-center flex flex-col items-center pb-1'
                  )}
               >
                  {tab.tabButton}
               </button>
            </li>
         );
      });

   const panes = () =>
      tabs.map((tab, index) => (
         <div
            className={classNames(
               {
                  isActive: index === activeTabIndex,
                  hidden: index !== activeTabIndex,
               },
               'h-full w-full'
            )}
            id={`tab-panel-${index}`}
            key={index}
         >
            {tab.tabPane}
         </div>
      ));

   return (
      <>
         <div className={classNames(className)}>
            <div className={classNames(styles['tabpanes'], 'h-full')}>
               {panes()}
            </div>
            <ul
               className={classNames(
                  styles['tablist'],
                  centerTabs && 'mx-auto',
                  tabBgColor
                     ? tabBgColor
                     : 'bg-emerald-primary w-[100vw] fixed bottom-0',
                  'grid grid-cols-5 rounded-t-sm lg:max-w-fit'
               )}
            >
               {navList()}
            </ul>
         </div>
      </>
   );
};
export default TabsNavigation;
