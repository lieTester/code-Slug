import { Session } from "next-auth";
import { ReactNode } from "react";

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
