import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib"; // You'll need to set up Prisma

const getAllTags = async (req: NextRequest, res: NextResponse) => {
   try {
      const tags = await prisma.tag.findMany();
      return NextResponse.json({ status: 200, tags });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};

export { getAllTags as GET };
