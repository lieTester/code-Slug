import { SessionAuthProvider } from "@/functions/SessionAuthProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
// component
import Header from "@/components/commonComponents/Header";

export const metadata: Metadata = {
   title: "Code-Slug",
   description: "To manage and solve dsa problems",
};
export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en">
         <body
            className={`${inter.className} w-screen min-h-screen h-full after:fixed after:inset-0 after after:bg-backg1  before:fixed before:right-0 before:top-10 before:inset-72  before:rounded-[90%] before:opacity-70 before:blur-[60px] before:bg-backg2  before:-z-10 after:-z-20`}
         >
            <SessionAuthProvider>
               <Header />
               {children}
            </SessionAuthProvider>
         </body>
      </html>
   );
}
