import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib"; // You'll need to set up Prisma

const getAllProblems = async (req: NextRequest, res: NextResponse) => {
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

      return NextResponse.json({ status: 200, data: transformedProblems });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
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
   try {
      // to double check if the user id is correct
      const user = await prisma.user.findFirst({
         where: { email: userId },
      });
      if (user) {
         const problemStatus = await prisma.problemStatus.findUnique({
            where: {
               UserProblemStatusUnique: {
                  problemId: problemID,
                  userId: user?.id,
               },
            },
         });
         if (problemStatus) {
            await prisma.problemStatus.update({
               where: {
                  UserProblemStatusUnique: {
                     problemId: problemID,
                     userId: user?.id,
                  },
               },
               data: { status: status },
            });
         } else {
            if (user) {
               await prisma.problemStatus.create({
                  data: {
                     status: status,
                     problemId: problemID,
                     userId: user?.id,
                  },
               });
            }
            return NextResponse.json({ status: 200 });
         }
      }
      return NextResponse.json({ status: 400 });
   } catch (error) {
      console.log(error);
      return NextResponse.json({ status: 500, error });
   }
};

const fetchUserProblemStatusForMonth = async ({
   userId,
   year,
   month,
}: {
   userId: string;
   year: number;
   month: number;
}) => {
   try {
      // Step 1: Check if the user exists
      const user = await prisma.user.findUnique({
         where: {
            id: userId,
         },
      });

      if (!user) {
         return {
            status: 404,
            message: "User not found",
         };
      }

      // Step 2: Set the date range for the given month and year
      const startDate = new Date(year, month - 1, 1); // Start of the month
      const endDate = new Date(year, month, 0); // End of the month

      // Step 3: Fetch the user's problem statuses for the given month
      const problemStatuses = await prisma.problemStatus.findMany({
         where: {
            userId: userId,
            updatedAt: {
               gte: startDate, // Greater than or equal to start of the month
               lte: endDate, // Less than or equal to the end of the month
            },
         },
         include: {
            problem: {
               select: {
                  id: true,
                  title: true,
               },
            },
         },
      });
      // Step 4: Format the data for the response

      type FormattedStatus = {
         problemId: number; // or number
         problemTitle: string;
         status: string;
         updatedAt: Date;
      };

      type StatusByDate = {
         [date: string]: { [status: string]: FormattedStatus[] };
      };

      const formattedStatuses: StatusByDate =
         problemStatuses.reduce<StatusByDate>((acc, status) => {
            const date = status.updatedAt.getDate(); // Extract the date part (YYYY-MM-DD)

            if (!acc[date]) {
               acc[date] = {}; // Initialize the array for this date if it doesn't exist
            }
            if (!acc[date][status.status]) {
               acc[date][status.status] = []; // Initialize the array for this date if it doesn't exist
            }
            acc[date][status.status].push({
               problemId: status.problem.id,
               problemTitle: status.problem.title,
               status: status.status,
               updatedAt: status.updatedAt,
            });

            return acc;
         }, {});

      // Step 5: Return the data
      return NextResponse.json({
         status: 200,
         message: "User's problem statuses for the month",
         monthStatus: formattedStatuses,
      });
   } catch (error) {
      console.log(error);
      return NextResponse.json({ status: 500, error });
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
         case "fetchUserProblemStatusForMonth":
            return await fetchUserProblemStatusForMonth({
               userId: data.userId,
               year: data.year,
               month: data.month,
            });

         default:
            break;
      }
   } catch (error) {
      console.log(error);
      return NextResponse.json({ status: 500, error });
   }
};

export { getAllProblems as GET, postRequestsForProblems as POST };
