import type { Metadata } from "next";

export const metadata: Metadata = {
   title: "List-Landing",
   description: "To manage creat and manage lists",
};
export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return <>{children}</>;
}
