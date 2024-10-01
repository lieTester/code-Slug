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
   like: number;
   dislike: number;
   isLiked?: boolean;
   description: string | null;
   topics?: string[];
   companies?: string[];
   PlatformLinks?: any[];
};

export type filterProp = {
   list?: string;
   status?: string;
   search?: string;
   topics?: string[];
   difficulty?: string;
   companies?: string[];
};
export type listProp = {
   id: string;
   name: string;
   slug: string;
   isPublic: boolean;
   isLinkedWithProblem?: boolean;
};
export type topicProp = {
   id: number;
   name: string;
   slug: string;
};
export type pageProp = {
   pageSize: number;
   currPage: number;
   totalPages: number;
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
   [key: string]: {
      id: number;
      name: string;
      topics: { id: number; name: string }[];
   };
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
};
export type ProblemAndTopicsOfTheDay = {
   dayProblems: {
      open: boolean;
      date?: Date;
      problems?: {
         problemId: number;
         problemTitle: string;
         status: string;
         updatedAt: Date;
         topics: {
            id: number;
            name: string;
         }[];
      }[];
   };
   setDayProblems: React.Dispatch<
      SetStateAction<{
         open: boolean;
         problems?: {
            problemId: number;
            problemTitle: string;
            status: string;
            updatedAt: Date;
            topics: {
               id: number;
               name: string;
            }[];
         }[];
      }>
   >;
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
export interface CalFullViewProps {
   color: string;
   userId: string;
   hoverColor: string;
   weekCalendarId: string;
   weekCalendarName: string;
}

export type StatusByDate = {
   [date: string]: {
      [status: string]: {
         problemId: number; // or number
         problemTitle: string;
         status: string;
         updatedAt: Date;
         topics: { id: number; name: string }[];
      }[];
   };
};
