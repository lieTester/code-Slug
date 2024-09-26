// pages/api/lists/public.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib";
import { ProblemsProp } from "@/types";
const getAllLists = async ({ userId }: { userId: string }) => {
   try {
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

      return NextResponse.json({
         status: 200,
         message: "fetched all public and user lists",
         lists,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({
         status: 500,
         error: "Internal Server Error",
      });
   }
};
const getProblemsInList = async ({ listId }: { listId: string }) => {
   // Basic input validation
   if (!listId) {
      return NextResponse.json({
         status: 400,
         message: "listId is required",
      });
   }
   try {
      const currentList = await prisma.list.findFirst({
         where: {
            id: listId,
         },
         include: {
            problems: {
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
            },
         },
      });
      const transformedProblems = currentList?.problems?.map((problem) => {
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
         message: "fetched problem related to lists",
         data: transformedProblems,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error: "Internal Server Error" });
   }
};

const createNewListForUser = async ({
   listName,
   userId,
   currentList,
}: {
   listName: string;
   userId: string;
   currentList: ProblemsProp[];
}) => {
   // Basic input validation
   if (!userId || !listName || !currentList || currentList.length === 0) {
      return NextResponse.json({
         status: 400,
         message: "User ID, List name, and at least one problem are required",
      });
   }

   try {
      // Check if the user exists
      const isUser = await prisma.user.findUnique({ where: { id: userId } });
      if (!isUser) {
         return NextResponse.json({
            status: 404,
            message: "User not found, please try again",
         });
      }

      // Create the new list and connect the provided problems
      const newList = await prisma.list.create({
         data: {
            name: listName,
            slug: listName.toLowerCase().replace(/ /g, "-"),
            isPublic: false,
            userId: userId,
            problems: {
               connect: currentList.map((problem: ProblemsProp) => ({
                  id: problem.id,
               })),
            },
         },
      });

      return NextResponse.json({
         status: 200,
         message: "List successfully created",
         data: newList,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({
         status: 500,
         error: "Internal Server Error",
      });
   }
};

const deleteListForUser = async ({
   userId,
   listId,
}: {
   userId: string;
   listId: string;
}) => {
   // Basic input validation
   if (!userId || !listId) {
      return NextResponse.json({
         status: 400,
         message: "User ID and List ID are required",
      });
   }
   try {
      const isUser = await prisma.user.findUnique({ where: { id: userId } });

      if (!isUser) {
         return NextResponse.json(
            { error: "User ID not provided" },
            { status: 400 }
         );
      }
      // Check if the list exists and belongs to the user
      const list = await prisma.list.findUnique({
         where: { id: listId },
         include: { user: true }, // Include user to check ownership
      });

      if (!list || list.isPublic) {
         return NextResponse.json(
            { error: "List not found or is Public" },
            { status: 404 }
         );
      }

      if (list.userId !== userId) {
         return NextResponse.json(
            { error: "Not authorized to delete this list" },
            { status: 403 }
         );
      }
      // Delete the list
      await prisma.list.delete({
         where: { id: listId },
      });

      return NextResponse.json({ message: "List deleted successfully" });
   } catch (error) {
      console.error(error);
      return NextResponse.json({
         status: 500,
         error: "Internal Server Error",
      });
   }
};
const unlinkProblemFromList = async ({
   userId,
   listId,
   problemId,
}: {
   userId: string;
   listId: string;
   problemId: number;
}) => {
   // Basic input validation
   if (!userId || !listId || !problemId) {
      return NextResponse.json({
         status: 400,
         message: "User ID, List ID and  Problem Id are required",
      });
   }
   try {
      const isUser = await prisma.user.findUnique({ where: { id: userId } });

      if (!isUser) {
         return NextResponse.json({
            status: 400,
            error: "User ID not provided",
         });
      }
      // Check if the list exists and belongs to the user
      const list = await prisma.list.findUnique({
         where: { id: listId },
         include: { user: true }, // Include user to check ownership
      });

      if (!list) {
         return NextResponse.json({
            status: 404,
            error: "List not found or is Public",
         });
      }

      if (list.isPublic || list.userId !== userId) {
         return NextResponse.json({
            status: 403,
            error: `Either isPublic or Not authorized User to unlink problem: ${problemId} from list: ${listId}`,
         });
      }
      // disconnect the problem from list
      await prisma.list.update({
         where: { id: listId },
         data: {
            problems: {
               disconnect: {
                  id: problemId,
               },
            },
         },
      });

      return NextResponse.json({ message: "List updated successfully" });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error: "Internal Server Error" });
   }
};

const updateUsersListName = async ({
   userId,
   listName,
   listId,
}: {
   userId: string;
   listName: string;
   listId: string;
}) => {
   // Basic input validation
   if (!userId || !listId || !listName) {
      return NextResponse.json({
         status: 400,
         message: "User ID, List ID and  listName are required",
      });
   }
   try {
      const isUser = await prisma.user.findUnique({ where: { id: userId } });
      if (!isUser) {
         return NextResponse.json({
            status: 400,
            error: "User ID don't exist or provided",
         });
      }
      // Check if the list exists and belongs to the user
      const list = await prisma.list.findUnique({
         where: { id: listId },
         include: { user: true }, // Include user to check ownership
      });

      if (!list) {
         return NextResponse.json({
            status: 404,
            error: "List not found or is Public",
         });
      }

      if (list.isPublic || list.userId !== userId) {
         return NextResponse.json({
            status: 403,
            error: `Either isPublic or Not authorized User to update listName of : ${listId}`,
         });
      }
      await prisma.list.update({
         where: {
            id: listId,
         },
         data: {
            name: listName,
            slug: listName.toLowerCase().replace(/ /g, "-"),
         },
      });
      return NextResponse.json({ message: "List name updated successfully" });
   } catch (error) {
      console.error(error);
      return NextResponse.json({
         status: 500,
         error: "Internal Server Error",
      });
   }
};

const getHandlerRequests = async (req: NextRequest, res: NextResponse) => {
   // getPublicAndUserCalendars;
   try {
      const { searchParams } = new URL(req.url);

      // Get all parameters at once
      const data = Object.fromEntries(searchParams.entries());

      switch (data.type) {
         case "getAllLists":
            return getAllLists({ userId: data.userId });
         case "getProblemsInList":
            return getProblemsInList({ listId: data.listId });

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
         case "createNewListForUser":
            return createNewListForUser({
               listName: data?.listName,
               userId: data?.userId,
               currentList: data?.currentList,
            });
         case "deleteListForUser":
            return deleteListForUser({
               userId: data?.userId,
               listId: data?.listId,
            });
         case "updateUsersListName":
            return updateUsersListName({
               userId: data?.userId,
               listName: data?.listName,
               listId: data?.listId,
            });
         case "unlinkProblemFromList":
            return unlinkProblemFromList({
               userId: data?.userId,
               listId: data?.listId,
               problemId: data?.problemId,
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
