import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib"; // You'll need to set up Prisma

const getAllProblems = async () => {
   try {
      const problems = await prisma.problem.findMany({
         include: {
            topics: {
               select: {
                  name: true,
               },
            },
            PlatformLinks: {
               select: {
                  name: true,
                  link: true,
               },
            },
            CompanyProblem: {
               select: {
                  company: {
                     select: {
                        name: true,
                     },
                  },
               },
            },
         },
      });

      const transformedProblems = problems?.map((problem) => {
         // Destructure the 'CompanyProblem' field to remove it
         const { CompanyProblem, ...rest } = problem;

         return {
            ...rest,
            status: "todo",
            topics: problem.topics.map((topic) => topic.name),
            companies: problem.CompanyProblem.map((cp) => cp.company.name),
         };
      });

      return NextResponse.json({
         status: 200,
         message: "All problem fetched successfully",
         data: transformedProblems,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};

// Fetch user's problem statuses by their ID
const getUserProblemsStatus = async (
   { userId }: { userId: string } // Expecting params to be passed correctly
) => {
   // Basic input validation
   if (!userId) {
      return NextResponse.json({
         status: 400,
         error: "User ID is required",
      });
   }
   try {
      // Fetch the user by their ID
      const user = await prisma.user.findUnique({
         where: { id: userId },
      });

      // If the user does not exist, return 404
      if (!user) {
         return NextResponse.json({
            status: 404,
            error: "User not found",
         });
      }

      // Fetch problems linked to the user and related data
      const problems = await prisma.problemStatus.findMany({
         where: {
            userId: user.id,
         },
         select: {
            problemId: true,
            status: true,
            like: true,
            problem: {
               select: {
                  title: true,
                  titleSlug: true,
               },
            },
         },
      });

      return NextResponse.json({
         status: 200,
         message: "User problem statuses fetched successfully",
         problems,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({
         status: 500,
         error: "Internal Server Error",
      });
   }
};

const updateUserProblemStatus = async ({
   userId,
   status,
   problemID,
}: {
   userId: string;
   status: string;
   problemID: number;
}) => {
   // Basic input validation
   if (!userId || !status || !problemID) {
      return NextResponse.json({
         status: 400,
         error: "User ID, Problem ID, and status are required",
      });
   }

   try {
      // Check if the user exists
      const user = await prisma.user.findFirst({
         where: { email: userId },
      });
      if (!user)
         return NextResponse.json({ status: 404, message: "User not found" });

      // Check if the problem exists
      const problem = await prisma.problem.findUnique({
         where: { id: problemID },
      });
      if (!problem)
         return NextResponse.json({
            status: 404,
            error: "Problem not found",
         });

      // Check if the problem status already exists
      const problemStatus = await prisma.problemStatus.findUnique({
         where: {
            UserProblemStatusUnique: {
               problemId: problemID,
               userId: user.id,
            },
         },
      });

      if (!problemStatus) {
         // Create new problem status if it does not exist
         await prisma.problemStatus.create({
            data: {
               status: status,
               problemId: problemID,
               userId: user.id,
            },
         });
      } else {
         // Update existing problem status
         await prisma.problemStatus.update({
            where: {
               UserProblemStatusUnique: {
                  problemId: problemID,
                  userId: user.id,
               },
            },
            data: { status: status },
         });
      }

      return NextResponse.json({
         status: 200,
         message: "Problem status updated successfully",
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error: "Internal server error" });
   }
};
const updateUserProblemLikeDislike = async ({
   userId,
   isLiked,
   problemID,
}: {
   userId: string;
   isLiked: boolean;
   problemID: number;
}) => {
   // Basic input validation

   if (!userId || isLiked === null || isLiked === undefined || !problemID) {
      return NextResponse.json({
         status: 400,
         error: "User ID, Problem ID, and isLiked are required",
      });
   }

   try {
      // Check if the user exists
      const user = await prisma.user.findFirst({
         where: { id: userId },
      });
      if (!user)
         return NextResponse.json({ status: 404, message: "User not found" });

      // Check if the problem exists
      const problem = await prisma.problem.findUnique({
         where: { id: problemID },
      });
      if (!problem)
         return NextResponse.json({
            status: 404,
            error: "Problem not found",
         });

      // Check if the problem status already exists
      const problemStatus = await prisma.problemStatus.findUnique({
         where: {
            UserProblemStatusUnique: {
               problemId: problemID,
               userId: user.id,
            },
         },
      });

      if (!problemStatus) {
         // Create new problem status if it does not exist
         await prisma.problemStatus.create({
            data: {
               like: isLiked,
               status: "todo",
               problemId: problemID,
               userId: user.id,
            },
         });
      } else {
         // Update existing problem status
         await prisma.problemStatus.update({
            where: {
               UserProblemStatusUnique: {
                  problemId: problemID,
                  userId: user.id,
               },
            },
            data: { like: isLiked },
         });
      }

      return NextResponse.json({
         status: 200,
         message: "Problem status updated successfully",
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error: "Internal server error" });
   }
};

const fetchUserProblemStatusForMonth = async ({
   userId,
   clientDate,
   timezoneOffset,
}: {
   userId: string;
   clientDate: string; // Date string from client (e.g., '2024-09-25')
   timezoneOffset: number; // Client's timezone offset in minutes (e.g., for GMT+3 it's -180)
}) => {
   // Validate inputs
   if (!userId || !clientDate || timezoneOffset === undefined) {
      return NextResponse.json({
         status: 400,
         error: "User ID, year, month, date, and timezone offset are required",
      });
   }

   try {
      // Step 1: Check if the user exists
      const user = await prisma.user.findUnique({
         where: { id: userId },
      });

      if (!user) {
         return NextResponse.json({
            status: 404,
            error: "User not found",
         });
      }

      // Step 2: Convert the client date to UTC based on their timezone
      const clientDateObj = new Date(clientDate);
      const userTimeInUTC = new Date(
         clientDateObj.getTime() + timezoneOffset * 60000
      );

      // Set the start and end dates for the user's month based on their timezone
      const startDate = new Date(
         userTimeInUTC.getUTCFullYear(),
         userTimeInUTC.getUTCMonth(),
         1,
         0,
         0,
         0
      );
      const endDate = new Date(
         userTimeInUTC.getUTCFullYear(),
         userTimeInUTC.getUTCMonth() + 1,
         0,
         23,
         59,
         59
      );

      // Step 3: Fetch the user's problem statuses for the adjusted month
      const problemStatuses = await prisma.problemStatus.findMany({
         where: {
            userId: userId,
            updatedAt: {
               gte: startDate, // Greater than or equal to the user's local start of the month
               lte: endDate, // Less than or equal to the user's local end of the month
            },
         },
         include: {
            problem: {
               select: {
                  id: true,
                  title: true,
                  topics: {
                     select: {
                        id: true,
                        name: true,
                     },
                  },
               },
            },
         },
      });

      type FormattedStatus = {
         problemId: number;
         problemTitle: string;
         status: string;
         updatedAt: Date;
         topics: { id: number; name: string }[];
      };

      type StatusByDate = {
         [date: string]: { [status: string]: FormattedStatus[] }; // Allow string indexing
      };

      const formattedStatuses: StatusByDate =
         problemStatuses.reduce<StatusByDate>((acc, status) => {
            const date = status.updatedAt.getDate();

            if (!acc[date]) {
               acc[date] = {};
            }
            if (!acc[date][status.status]) {
               acc[date][status.status] = [];
            }

            acc[date][status.status].push({
               problemId: status.problem.id,
               problemTitle: status.problem.title,
               status: status.status,
               updatedAt: status.updatedAt,
               topics: status.problem.topics.map((topic) => ({
                  id: topic.id,
                  name: topic.name,
               })),
            });

            return acc;
         }, {});

      return NextResponse.json({
         status: 200,
         message: "User's problem statuses for the month",
         monthStatus: formattedStatuses,
      });
   } catch (error) {
      console.log(error);
      return NextResponse.json({ status: 500, error: "Internal Server Error" });
   }
};

const getHandlerRequests = async (req: NextRequest, res: NextResponse) => {
   // getPublicAndUserCalendars;
   try {
      const { searchParams } = new URL(req.url);

      // Get all parameters at once
      const data = Object.fromEntries(searchParams.entries());

      switch (data.type) {
         case "getAllProblems":
            return getAllProblems();
         case "getUserProblemsStatus":
            return getUserProblemsStatus({ userId: data.userId });

         case "fetchUserProblemStatusForMonth":
            return await fetchUserProblemStatusForMonth({
               userId: data.userId,
               clientDate: data.clientDate,
               timezoneOffset: Number(data.timezoneOffset),
            });
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
         case "updateUserProblemStatus":
            return await updateUserProblemStatus({
               userId: data.userId,
               status: data.status,
               problemID: data.problemID,
            });
         case "updateUserProblemLikeDislike":
            return await updateUserProblemLikeDislike({
               userId: data.userId,
               isLiked: data.isLiked,
               problemID: data.problemID,
            });

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
