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
   tags?: string[];
   companies?: string[];
   PlatformLinks?: any[];
};

export type filterProps = {
   status?: string;
   dificulty?: string;
   list?: string;
   companies?: string[];
   topics?: string[];
};
