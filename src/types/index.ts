import { Session } from "next-auth";

export type AuthCredType = {
   clientId: string;
   clientSecret: string;
};

export type SessionProp = {
   session?: Session | null;
};
