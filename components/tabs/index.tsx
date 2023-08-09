'use client';

import { TabProps } from '@/lib/types';
import classNames from 'classnames';
import { useState } from 'react';
import styles from './tabs.module.css';

const Tabs = (props: TabProps) => {
   const [activeTabIndex, setActiveTabIndex] = useState(0);
   const { tabs, className } = props;

   const navList = () =>
      tabs.map((tab, index) => {
         const key = typeof tab.tabButton === 'string' ? tab.tabButton : index;
         const isActive = index === activeTabIndex;
         return (
            <li
               key={key}
               className={classNames(
                  isActive && styles['nav-active'],
                  !isActive && 'overflow-hidden h-0',
                  'lg:inline-flex lg:h-auto p-2'
               )}
            >
               <button
                  onClick={(e) => {
                     e.preventDefault();
                     setActiveTabIndex(index);
                  }}
                  className={'text-center p-1'}
               >
                  {tab.tabButton}
               </button>
            </li>
         );
      });

   const panes = () =>
      tabs.map((tab, index) => (
         <div
            className={classNames({
               isActive: index === activeTabIndex,
               hidden: index !== activeTabIndex,
            })}
            id={`tab-panel-${index}`}
            key={index}
         >
            {tab.tabPane}
         </div>
      ));

   return (
      <>
         <section className={className}>
            <ul
               className={`${styles['tablist']} flex flex-row bg-emerald-primary justify-between rounded-t-sm max-w-fit mx-auto`}
            >
               {navList()}
            </ul>
            <div className={`${styles['tabpanes']}`}>{panes()}</div>
         </section>
      </>
   );
};
export default Tabs;
