import type { Metadata } from "next";

export const metadata: Metadata = {
   title: "Create-Edit-List",
   description: "To create edit list to manage and import questions",
};
export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return <>{children}</>;
}
