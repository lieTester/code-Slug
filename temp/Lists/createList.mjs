import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const createUser = async () => {
   await prisma.user
      .create({
         data: {
            username: "default",
            email: "default@codeSlug.code",
            profile: "default",
         },
      })
      .then((res) => {
         console.log(res);
      });
};
// createUser();

const createList = async () => {
   const lists = [
      {
         name: "Blind 75",
         slug: "blind-75",
         isPublic: true,
         userId: "4700e564-28f7-4807-862c-b5387152a571",
      },
      {
         name: "Neetcode 150",
         slug: "neetcode-150",
         isPublic: true,
         userId: "4700e564-28f7-4807-862c-b5387152a571",
      },
      {
         name: "Striver SDE Sheet",
         slug: "striver-sde-sheet",
         isPublic: true,
         userId: "4700e564-28f7-4807-862c-b5387152a571",
      },
   ];
   lists.forEach(async ({ name, slug, isPublic, userId }) => {
      await prisma.list
         .create({
            data: {
               name,
               slug,
               isPublic,
               userId,
            },
         })
         .then((res) => console.log(res));
   });
};

// createList();
async function connectProblemsToList() {
   try {
      const problemUrls = [
         "https://leetcode.com/problems/detect-squares/",
         "https://leetcode.com/problems/minimum-interval-to-include-each-query/",
         "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/",
         "https://leetcode.com/problems/min-cost-to-connect-all-points/",
         "https://leetcode.com/problems/count-good-nodes-in-binary-tree/",
      ];

      // First, find the list you want to connect the problems to
      const list = await prisma.list.findUnique({
         where: {
            id: "be12a933-18e5-42e9-8da2-84500e33eddf",
         },
      });

      if (!list) {
         console.log(
            `List with ID be12a933-18e5-42e9-8da2-84500e33eddf not found.`
         );
         return;
      }

      // Now, iterate through the problem URLs and connect them to the list
      for (const url of problemUrls) {
         // Extract the problem slug from the URL (you may need to adjust this based on your schema)
         const temp = url.split("/"); // Assuming the slug is the last part of the URL
         const problemSlug = temp[temp.length - 2]; // Assuming the slug is the last part of the URL

         // Find the problem using the slug
         const problem = await prisma.problem.findFirst({
            where: {
               titleSlug: problemSlug,
            },
         });

         if (!problem) {
            console.log(`Problem with slug ${problemSlug} not found.`);
         } else {
            // Connect the problem to the list
            // Check if the problem is not already connected to the list
            const isProblemInList = await prisma.list.findFirst({
               where: {
                  id: list.id,
                  problems: { some: { id: problem.id } },
               },
            });

            if (!isProblemInList) {
               // Connect the problem to the list
               const updatedList = await prisma.list.update({
                  where: { id: list.id },
                  data: {
                     problems: {
                        connect: { id: problem.id },
                     },
                  },
               });

               console.log(
                  `Connected problem ${problem.title} to list ${updatedList.name}`
               );
            }
         }
      }
   } catch (error) {
      console.error("Error adding tags to the database:", error);
   } finally {
      await prisma.$disconnect();
   }
}

connectProblemsToList();

async function disconnectListFromProblems(listId) {
   try {
      // Find the list by its ID
      const list = await prisma.list.findUnique({
         where: {
            id: listId,
         },
      });

      if (!list) {
         console.log(`List with ID ${listId} not found.`);
         return;
      }

      const problems = await prisma.problem.findMany({
         where: {
            lists: {
               some: {
                  id: listId,
               },
            },
         },
      });

      // Disconnect the list from each problem
      for (const problem of problems) {
         await prisma.problem.update({
            where: { id: problem.id },
            data: {
               lists: {
                  disconnect: {
                     id: listId,
                  },
               },
            },
         });
      }

      console.log(`Disconnected list ${updatedList.name} from all problems.`);
   } catch (error) {
      console.error("Error:", error);
   } finally {
      await prisma.$disconnect();
   }
}

// Call the function with the ID of the list you want to disconnect
// disconnectListFromProblems(listIdToDisconnect);
const listIdToDisconnect = "d32bf1a5-164d-4dd9-a04f-6db6eb614e8a"; // Replace with the actual list ID
