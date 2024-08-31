'use client';

import { TabProps } from '@/lib/types';
import classNames from 'classnames';
import { useState } from 'react';
import styles from './tabs.module.css';

const Tabs = ({
   tabs,
   activeTabName,
   centerTabs,
   className,
   link,
   linkType,
   tabBgColor,
   text,
   useHash,
   saveState = true,
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
                  isActive ? styles['nav-active'] : styles['nav-inactive'],
                  'h-[66px] inline-flex text-center p-2 items-end justify-center md:h-auto md:border-r-2 md:border-r-emerald-600 md:p-0 md:last-of-type:border-none lg:h-auto'
               )}
            >
               <button
                  onClick={(e) => {
                     e.preventDefault();
                     setActiveTabIndex(index);
                  }}
                  className={
                     'flex flex-col items-center pb-1 text-white md:block text-center md:p-3'
                  }
               >
                  {tab.tabButton}
               </button>
            </li>
         );
      });

   const panes = () =>
      tabs.map((tab, index) => {
         if (saveState) {
            return (
               <div
                  className={classNames(
                     index === activeTabIndex ? 'block' : 'hidden',
                     'h-full w-full'
                  )}
                  id={`tab-panel-${index}`}
                  key={index}
               >
                  {tab.tabPane}
               </div>
            );
         }
         if (index === activeTabIndex) {
            return (
               <div
                  className={classNames('md:block h-full w-full')}
                  id={`tab-panel-${index}`}
                  key={index}
               >
                  {tab.tabPane}
               </div>
            );
         } else {
            return <></>;
         }
      });

   return (
      <>
         <div className={classNames(className)}>
            <ul
               className={classNames(
                  styles['tablist'],
                  centerTabs && 'mx-auto',
                  tabBgColor ? tabBgColor : 'w-[100vw] bg-emerald-primary',
                  'grid grid-cols-5 fixed bottom-0 rounded-t-sm shadow-black shadow z-10 md:justify-between md:w-auto md:flex md:static md:shadow-none md:flex-row lg:max-w-fit lg:h-[50px]'
               )}
            >
               {navList()}
            </ul>
            <div className={classNames(`${styles['tabpanes']}`, ' h-full')}>
               {panes()}
            </div>
         </div>
      </>
   );
};
export default Tabs;
