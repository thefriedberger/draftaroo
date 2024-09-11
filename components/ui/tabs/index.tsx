'use client';

import { TabProps } from '@/lib/types';
import classNames from 'classnames';
import { Fragment, useState } from 'react';
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
                  'h-[66px] inline-flex text-center p-2 items-end justify-center lg:h-auto lg:border-r-2 lg:border-r-emerald-600 lg:p-0 lg:last-of-type:border-none lg:h-auto'
               )}
            >
               <button
                  onClick={(e) => {
                     e.preventDefault();
                     setActiveTabIndex(index);
                  }}
                  className={
                     'flex flex-col items-center pb-1 text-white lg:block text-center lg:p-3'
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
                  className={classNames('lg:block h-full w-full')}
                  id={`tab-panel-${index}`}
                  key={index}
               >
                  {tab.tabPane}
               </div>
            );
         } else {
            return <Fragment key={index} />;
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
                  'grid fixed bottom-0 rounded-t-sm shadow-black shadow z-10 lg:justify-between lg:w-auto lg:flex lg:static lg:shadow-none lg:flex-row lg:text-left md-items-center lg:max-w-fit lg:h-[50px]',
                  `grid-cols-${tabs.length}`
               )}
            >
               {navList()}
            </ul>
            <div
               className={classNames(
                  `${styles['tabpanes']}`,
                  'pb-[66px] lg:pb-0 h-full'
               )}
            >
               {panes()}
            </div>
         </div>
      </>
   );
};
export default Tabs;
