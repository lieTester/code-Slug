// pages/api/lists/public.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib";

const getAllLists = async (req: NextRequest, res: NextResponse) => {
   try {
      const { user } = await req.json();
      const lists = await prisma.user
         .findFirst({
            where: { username: "default" },
         })
         .then(async (user: any) => {
            return await prisma.list.findMany({
               where: {
                  userId: user.id,
               },
               select: { id: true, name: true, slug: true },
            });
         });
      if (user) {
         await prisma.user
            .findUnique({
               where: { id: user },
            })
            .then(async (user: any) => {
               await prisma.list
                  .findMany({
                     where: {
                        userId: user.id,
                     },
                     select: { id: true, name: true, slug: true },
                  })
                  .then((res: any) => {
                     lists.push(...res);
                  });
            });
      }
      // console.log(lists, user);
      return NextResponse.json({ status: 200, lists });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error: "Internal Server Error" });
   }
};

export { getAllLists as POST };
