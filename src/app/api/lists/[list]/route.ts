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
      const currentList = await prisma.list.findFirst({
         where: {
            id: listId,
         },
         include: {
            problems: {
               include: {
                  tags: {
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
            tags: problem.tags.map((tag) => tag.name),
            companies: problem.CompanyProblem.map((cp) => cp.company.name),
         };
      });
      return NextResponse.json({ status: 200, data: transformedProblems });
   } catch (error) {
      // console.error(error);
      return NextResponse.json({ status: 500, params, error });
   }
};

const createNewListForUser = async (
   userId: string,
   currentList: ProblemsProp[],
   list: string
) => {
   try {
      const isUser = await prisma.user.findUnique({ where: { id: userId } });
      if (isUser) {
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
      }
      return NextResponse.json({ status: 200, msg: "successfully created" });
   } catch (error) {
      console.log(error);
      return NextResponse.json({
         status: 500,
         params: { userId, list, currentList },
         error,
      });
   }
};
const deleteListForUser = async (userId: string, listId: string) => {
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
const unlinkProblemFromList = async (
   userId: string,
   listId: string,
   problemId: number
) => {
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

const updateUsersListName = async (
   userId: string,
   listName: string,
   listId: string
) => {
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
            return createNewListForUser(
               data?.user,
               data.currentList,
               params.list
            );
         case "deleteListForUser":
            return deleteListForUser(data?.user, params.list);
         case "updateUsersListName":
            return updateUsersListName(data?.user, data?.listName, params.list);
         case "unlinkProblemFromList":
            return unlinkProblemFromList(
               data?.user,
               params.list,
               data?.problemId
            );

         default:
            break;
      }
   } catch (error) {
      return NextResponse.json({
         status: 500,
         params,
         error,
      });
   }
};

export { getProblemsInList as GET, acceptPostRequestOnListsUrl as POST };
