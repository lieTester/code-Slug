import type { Metadata } from "next";

export const metadata: Metadata = {
   title: "Mark-Calender",
   description: "Mark your Calendar to manage to solve problem",
};
export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return <>{children}</>;
}
