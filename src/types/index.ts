import { Session } from "next-auth";
import { ReactNode, SetStateAction } from "react";

export type AuthCredType = {
   clientId: string;
   clientSecret: string;
};

export type SessionProp = {
   session: Session | null | undefined;
};
export type ChildrenProp = {
   children: ReactNode;
};

export type ProblemsProp = {
   id: number;
   title: string;
   status?: string;
   titleSlug: string;
   frontEndId?: string;
   difficulty: string;
   description: string | null;
   topics?: string[];
   companies?: string[];
   PlatformLinks?: any[];
};

export type filterProp = {
   status?: string;
   dificulty?: string;
   list?: string;
   companies?: string[];
   topics?: string[];
};
export type listProp = {
   id: string;
   name: string;
   slug: string;
   isPublic: boolean;
};
export type topicProp = {
   id: string;
   name: string;
   slug: string;
};
export type companieProp = {
   id: string;
   name: string;
   slug: string;
};
export type calendarsProp = {
   id: string;
   title: string;
   days: {
      id: number;
      name: string;
      count?: number;
      topics?: { id: number; name: string }[];
   }[];
};
export type viewCalendarDataProp = {
   [key: string]: { id: number; name: string; topics: any[] };
};
export type AddTopicInWeekDay = {
   weekDaySettings: {
      day?: string;
      dayId?: number;
      open: boolean;
      color?: string;
      banner?: number;
      hoverColor?: string;
   };
   setWeekDaySettings: React.Dispatch<
      SetStateAction<{
         day?: string;
         dayId?: number;
         open: boolean;
         color?: string;
         banner?: number;
         hoverColor?: string;
      }>
   >;
   weekCalendarId: string;
};

export interface CalWeekBannerProps extends ChildrenProp {
   day: string;
   dayId: number;
   color: string;
   hoverColor: string;
   setOpen: React.Dispatch<
      SetStateAction<{
         day?: string;
         dayId?: number;
         open: boolean;
         color?: string;
         banner?: number;
         hoverColor?: string;
      }>
   >;
}
