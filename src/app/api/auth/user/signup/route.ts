import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib"; // You'll need to set up Prisma

const SignUp = async (req: NextRequest, res: NextResponse) => {
   try {
      // console.log(req.body);
      const { email, username, profile } = await req.json();
      const user = await prisma.user.create({
         data: { email, username, profile },
      });
      console.log(user);
      if (user && user.email)
         return NextResponse.json({ status: 200, value: true });
      return NextResponse.json({ status: 200, value: false });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};

export { SignUp as POST };
