import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib"; // You'll need to set up Prisma

const userCheck = async (req: NextRequest, res: NextResponse) => {
   try {
      // console.log(await req.json());
      const { email } = await req.json();
      const user = await prisma.user.findFirst({ where: { email: email } });
      if (user && user.email) {
         // console.log(user.email);
         return NextResponse.json({ status: 200, value: true, id: user.id });
      }
      return NextResponse.json({ status: 200, value: false });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};

export { userCheck as POST };
