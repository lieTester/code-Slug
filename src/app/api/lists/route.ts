// pages/api/lists/public.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib";

const getAllLists = async (req: NextRequest, res: NextResponse) => {
   try {
      const { user: userId } = await req.json();

      // Fetch lists for the default user
      const defaultUser = await prisma.user.findFirst({
         where: { username: "default" },
      });

      if (!defaultUser) {
         return NextResponse.json({
            status: 404,
            message: "Default user not found",
         });
      }

      let lists = await prisma.list.findMany({
         where: { userId: defaultUser.id },
         select: { id: true, name: true, slug: true, isPublic: true },
      });

      // If a user ID is provided, fetch their lists as well
      if (userId) {
         const user = await prisma.user.findUnique({
            where: { id: userId },
         });

         if (user) {
            const userLists = await prisma.list.findMany({
               where: { userId: user.id },
               select: { id: true, name: true, slug: true, isPublic: true },
            });

            // Merge user lists with the default lists
            lists = [...lists, ...userLists];
         }
      }

      return NextResponse.json({ status: 200, lists });
   } catch (error) {
      console.error("getAllLists Error:", error);
      return NextResponse.json({
         status: 500,
         error: "Internal Server Error",
      });
   }
};

export { getAllLists as POST };
