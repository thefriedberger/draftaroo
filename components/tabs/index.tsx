'use client';

import { TabProps } from '@/lib/types';
import classNames from 'classnames';
import { useState } from 'react';
import styles from './tabs.module.css';

const Tabs = (props: TabProps) => {
   const [activeTabIndex, setActiveTabIndex] = useState(0);
   const { tabs } = props;

   const navList = () =>
      tabs.map((tab, index) => {
         const key = typeof tab.tabButton === 'string' ? tab.tabButton : index;
         const isActive = index === activeTabIndex;
         return (
            <li
               key={key}
               className={classNames(
                  isActive && styles['nav-active'],
                  'inline-flex lg:h-auto text-center items-end border-r-2 border-r-emerald-600 last-of-type:border-none'
               )}
            >
               <button
                  onClick={(e) => {
                     e.preventDefault();
                     setActiveTabIndex(index);
                  }}
                  className={'text-center p-3 '}
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
         <div className={classNames(props.className)}>
            <ul
               className={classNames(
                  styles['tablist'],
                  props.tabBgColor ? props.tabBgColor : 'bg-emerald-primary',
                  'flex flex-row justify-between rounded-t-sm lg:max-w-fit mx-auto'
               )}
            >
               {navList()}
            </ul>
            <div className={`${styles['tabpanes']}`}>{panes()}</div>
         </div>
      </>
   );
};
export default Tabs;
