import { formStatus, formType } from '@/components/modals/auth';
import { AnchorHTMLAttributes, ReactNode } from 'react';

export interface BaseProps {
   title?: string;
}
export interface Link {
   href?: string;
   text?: string;
   target?: AnchorHTMLAttributes<HTMLAnchorElement>;
}
export interface CalloutProps {
   calloutText?: string;
   link?: Link;
}

export interface TabProps {
   text?: string;
   linkType?: string;
   link?: string;
}

export interface TeamProps {
   team_name: string;
   owner: string;
   league_id: string;
}

export interface UserProps {
   email: string;
   password: string;
   firstName: string;
   lastName: string;
   username: string;
   origin: string;
}

export interface Tab {
   tabButton: ReactNode | any;
   linkTab?: boolean;
   tabPane?: ReactNode | string;
}
export interface TabProps {
   tabs: Tab[];
   className?: string;
   useHash?: boolean;
   activeTabName?: string;
   tabBgColor?: string;
}
export interface Profile {
   firstName: string;
   lastName: string;
   email: string;
   username: string;
}

export interface ModalProps {
   buttonClass?: string;
   buttonText?: string;
}

export interface DropdownProps {
   links: ReactNode[] | Link[] | any[];
   className?: string;
}

export interface AuthFormProps {
   setFormType: (formType: formType) => void;
   setView: (view: formStatus) => void;
}
