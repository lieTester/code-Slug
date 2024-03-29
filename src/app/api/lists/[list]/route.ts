// pages/api/lists/[listId]/problems.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib";
import { ProblemsProp } from "@/types";

const getProblemsInList = async (
   req: NextRequest,
   { params }: { params: { list: string } }
) => {
   try {
      const listId = params.list;
      if (!listId) {
         return NextResponse.json({
            status: 400,
            message: "List ID  are required",
         });
      }
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
      return NextResponse.json({ status: 200, data: transformedProblems });
   } catch (error) {
      // console.error(error);
      return NextResponse.json({ status: 500, params, error });
   }
};

const createNewListForUser = async ({
   list,
   userId,
   currentList,
}: {
   list: string;
   userId: string;
   currentList: ProblemsProp[];
}) => {
   // Basic input validation
   if (!userId || !list || !currentList || !currentList.length) {
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
            name: list,
            slug: list.toLowerCase().replace(/ /g, "-"),
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
      // Log the error for debugging
      console.error("Error creating list:", error);

      return NextResponse.json({
         status: 500,
         message: "Internal server error",
         params: { userId, list, currentList },
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
      console.error("Error deleting list:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
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

      if (!list) {
         return NextResponse.json(
            { error: "List not found or is Public" },
            { status: 404 }
         );
      }

      if (list.isPublic || list.userId !== userId) {
         return NextResponse.json(
            {
               error: `Either isPublic or Not authorized User to unlink problem: ${problemId} from list: ${listId}`,
            },
            { status: 403 }
         );
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
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
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
         return NextResponse.json(
            { error: "User ID don't exist or provided" },
            { status: 400 }
         );
      }
      // Check if the list exists and belongs to the user
      const list = await prisma.list.findUnique({
         where: { id: listId },
         include: { user: true }, // Include user to check ownership
      });

      if (!list) {
         return NextResponse.json(
            { error: "List not found or is Public" },
            { status: 404 }
         );
      }

      if (list.isPublic || list.userId !== userId) {
         return NextResponse.json(
            {
               error: `Either isPublic or Not authorized User to update listName of : ${listId}`,
            },
            { status: 403 }
         );
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
      console.error("Error updating list:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
};

const acceptPostRequestOnListsUrl = async (
   req: NextRequest,
   { params }: { params: { list: string } }
) => {
   try {
      const data = await req.json();
      switch (data.type) {
         case "createNewListForUser":
            return createNewListForUser({
               list: params.list,
               userId: data?.user,
               currentList: data.currentList,
            });
         case "deleteListForUser":
            return deleteListForUser({
               userId: data?.user,
               listId: params.list,
            });
         case "updateUsersListName":
            return updateUsersListName({
               userId: data?.user,
               listName: data?.listName,
               listId: params.list,
            });
         case "unlinkProblemFromList":
            return unlinkProblemFromList({
               userId: data?.user,
               listId: params.list,
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
         message: "Request error",
         error,
      });
   }
};

export { getProblemsInList as GET, acceptPostRequestOnListsUrl as POST };
