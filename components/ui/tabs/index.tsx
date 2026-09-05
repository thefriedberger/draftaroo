'use client';

import { TabProps } from '@/lib/types';
import classNames from 'classnames';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
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
   gridColumns,
}: TabProps) => {
   const [activeTabHash, setActiveTabHash] = useState<string>(location.hash);
   const [activeTabIndex, setActiveTabIndex] = useState(0);
   const pathname = usePathname();
   const searchParams = useSearchParams();

   useEffect(() => {
      const handleHashChange = () => {
         setActiveTabHash(window.location.hash);
         console.log('Hash changed to:', window.location.hash);
      };

      window.addEventListener('hashchange', handleHashChange);

      handleHashChange();

      return () => {
         window.removeEventListener('hashchange', handleHashChange);
      };
   }, [pathname, searchParams]);

   useEffect(() => {
      if (activeTabHash) {
         const activeTab = (tabs ?? {}).find(
            (tab) =>
               `#${(
                  tab?.tabButton?.props?.children?.[1]?.props?.children ||
                  tab.tabButton ||
                  ''
               )
                  .toLocaleLowerCase()
                  .replace(' ', '-')}` === activeTabHash
         );

         if (activeTab)
            setActiveTabIndex(
               (tabs ?? {}).findIndex((tab) => tab === activeTab)
            );
      }
   }, [activeTabHash]);

   const navList = () =>
      tabs.map((tab, index) => {
         const key = typeof tab.tabButton === 'string' ? tab.tabButton : index;
         const isActive = index === activeTabIndex;
         return (
            <li
               key={key}
               className={classNames(
                  isActive ? styles['nav-active'] : styles['nav-inactive'],
                  'h-[66px] inline-flex text-center p-0 items-center justify-center lg:h-auto lg:border-r-2 lg:border-r-emerald-600 lg:last-of-type:border-none'
               )}
            >
               <button
                  onClick={(e) => {
                     e.preventDefault();
                     setActiveTabIndex(index);
                     setActiveTabHash(
                        `#${(
                           tab?.tabButton?.props?.children?.[1]?.props
                              ?.children ||
                           tab.tabButton ||
                           ''
                        )
                           .toLocaleLowerCase()
                           .replace(' ', '-')}`
                     );
                     window.location.hash = `#${(
                        tab?.tabButton?.props?.children?.[1]?.props?.children ||
                        tab.tabButton ||
                        ''
                     )
                        .toLocaleLowerCase()
                        .replace(' ', '-')}`;
                  }}
                  className={
                     'flex flex-col items-center text-white lg:block text-center lg:p-2'
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
                  'grid fixed bottom-0 rounded-t-sm shadow-black shadow z-10 lg:justify-between lg:w-auto lg:flex lg:static lg:shadow-none lg:flex-row lg:text-left md-items-center lg:max-w-fit',
                  gridColumns
               )}
            >
               {navList()}
            </ul>
            <div
               className={classNames(
                  `${styles['tabpanes']}`,
                  'pb-[46px] lg:pb-0 h-full'
               )}
            >
               {panes()}
            </div>
         </div>
      </>
   );
};
export default Tabs;
