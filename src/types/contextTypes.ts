import { Session } from "next-auth";

// SessionContext.tsx
export type SessionContextType = {
   session: any;
   setSession: React.Dispatch<React.SetStateAction<any>>;
};
