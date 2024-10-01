import fs from "fs";
import { PrismaClient } from "@prisma/client";
import pLimit from "p-limit"; // Import the p-limit library

const prisma = new PrismaClient();
const limit = pLimit(5); // Limit the concurrency to 5 connections

// Function to add company problem data to the database
const capatalize = (name) => {
   return name
      .split(" ") // Split the string by spaces
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(" ");
};
async function addCompanyProblem(problemName, companies, numOccurs) {
   try {
      const problem = await prisma.problem.findFirst({
         where: { title: problemName },
      });

      if (problem) {
         await Promise.all(
            companies.map(async (companyName, i) => {
               const company = await prisma.company.findFirst({
                  where: { name: capatalize(companyName) },
               });

               if (company) {
                  const companyProblem = await prisma.companyProblem.findFirst({
                     where: {
                        AND: [
                           { companyId: company.id },
                           { problemId: problem.id },
                        ],
                     },
                  });
                  if (!companyProblem) {
                     await prisma.companyProblem.create({
                        data: {
                           company: {
                              connect: { id: company.id },
                           },
                           problem: {
                              connect: { id: problem.id },
                           },

                           count: parseInt(numOccurs[i], 10),
                        },
                     });
                     console.log(`Added data: ${problemName} ${companyName} `);
                  }
               } else {
                  console.error(`Company not found: ${companyName}`);
               }
            })
         );
      } else {
         console.error(`Problem not found: ${problemName}`);
      }
   } catch (error) {
      console.error("Error adding data to the database:", problemName, error);
   }
}

// Read data from the JSON file
const jsonFilePath = "./temp/company/combined_data.json";

fs.readFile(jsonFilePath, "utf-8", (err, data) => {
   if (err) {
      console.error("Error reading the JSON file:", err);
   } else {
      const combinedData = JSON.parse(data);
      // prisma.companyProblem.deleteMany();

      // Iterate over the data and add it to the database using concurrency control
      combinedData.forEach((item) => {
         const { problem_name, company, num_occur } = item;
         limit(() => addCompanyProblem(problem_name, company, num_occur));
      });
   }
});
