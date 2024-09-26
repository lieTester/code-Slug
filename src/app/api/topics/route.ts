import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib"; // You'll need to set up Prisma

const getAllTopics = async () => {
   try {
      const topics = await prisma.topic.findMany();
      return NextResponse.json({
         status: 200,
         message: "fetched all topics",
         topics,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};

const getHandlerRequests = async (req: NextRequest, res: NextResponse) => {
   // getPublicAndUserCalendars;
   try {
      const { searchParams } = new URL(req.url);

      // Get all parameters at once
      const data = Object.fromEntries(searchParams.entries());

      switch (data.type) {
         case "getAllTopics":
            return getAllTopics();

         default:
            return NextResponse.json({
               status: 400,
               message: "Invalid request type",
            });
      }
   } catch (error) {
      return NextResponse.json({
         status: 500,
         error,
      });
   }
};
const postRequestsForProblems = async (req: NextRequest, res: NextResponse) => {
   try {
      const data = await req.json();
      switch (data.type) {
         default:
            return NextResponse.json({
               status: 400,
               message: "Invalid request type",
            });
      }
   } catch (error) {
      return NextResponse.json({
         status: 500,
         error,
      });
   }
};

export { getHandlerRequests as GET, postRequestsForProblems as POST };
