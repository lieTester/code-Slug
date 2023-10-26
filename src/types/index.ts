import { Session } from "next-auth";
import { ReactNode } from "react";

export type AuthCredType = {
   clientId: string;
   clientSecret: string;
};

export type SessionProp = {
   session?: Session | null;
};
export type ChildrenProp = {
   children: ReactNode;
};

export type ProblemsProp = {
   description: String | null;
   difficulty: String;
   frontEndId: String | number;
   id: number;
   platform: String;
   platformPath: String;
   title: String;
   titleSlug: String;
};
