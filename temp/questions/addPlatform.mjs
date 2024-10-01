import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function createPlatformsAndLinkToProblems() {
   try {
      const filePath = "./temp/questions/newDataQuestions.json"; // Replace with the path to your JSON file
      const problemsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      for (const problemData of problemsData) {
         const { titleSlug } = problemData;

         // Find the corresponding Problem record based on titleSlug
         const problem = await prisma.problem.findFirst({
            where: { titleSlug: titleSlug },
         });

         if (problem) {
            const platformLink = `https://leetcode.com/problems/${titleSlug}`;

            // Create a Platform record and link it to the Problem
            await prisma.platform.create({
               data: {
                  link: platformLink,
                  name: "leetcode", // Or use problemData.name if available
                  problemId: problem.id,
               },
            });

            console.log(`Created Platform record for ${problemData.title}`);
         } else {
            console.log(`Problem not found for titleSlug: ${titleSlug}`);
         }
      }
   } catch (error) {
      console.error("Error adding problems and tags to the database:", error);
   } finally {
      await prisma.$disconnect();
   }
}

// Call the function to create Platform records and link them to Problems
createPlatformsAndLinkToProblems();
