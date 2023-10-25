// pages/api/lists/public.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllLists = async (req: NextRequest, res: NextResponse) => {
   try {
      const publicLists = await prisma.list.findMany({
         where: {
            isPublic: true,
         },
      });
      return NextResponse.json({ status: 200, data: publicLists });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error: "Internal Server Error" });
   }
};

export { getAllLists as GET, getAllLists as POST };
