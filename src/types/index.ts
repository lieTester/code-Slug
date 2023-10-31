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
   companyProblems?: String[];
   PlatformLinks?: any[];
   tags?: String[];
   status?: String;
   description: String | null;
   difficulty: String;
   id: number;
   title: String;
   titleSlug: String;
};

export type filterProps = {
   status?: String;
   dificulty?: String;
   list?: String;
   companies?: String[];
   topics?: String[];
};
