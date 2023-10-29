import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib"; // You'll need to set up Prisma

const getAllCompanies = async (req: NextRequest, res: NextResponse) => {
   try {
      const companies = await prisma.company.findMany();

      return NextResponse.json({ status: 200, companies });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};

export { getAllCompanies as GET };
