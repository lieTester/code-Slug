import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Function to add a company to the database
async function addCompany(id, name, slug) {
   try {
      const existingCompany = await prisma.company.findFirst({
         where: { name },
      });

      if (!existingCompany) {
         const newCompany = await prisma.company.create({
            data: { id, name, slug },
         });
         console.log(`Added company: ${name}`);
      } else {
         console.log(`Company already exists: ${name}`);
      }
   } catch (error) {
      console.error(`Error adding company: ${name}`, error);
   }
}

// Function to process JSON data and add companies to the database
async function processJSONData() {
   const filePath = "./temp/company/companies.json";

   try {
      // Read file synchronously
      const data = fs.readFileSync(filePath, "utf-8");
      const jsonData = JSON.parse(data);

      // Iterate over the company list and add them to the DB
      for (let i = 0; i < jsonData.length; i++) {
         const company = jsonData[i];
         await addCompany(
            i + 1, // Auto-incrementing ID starting from 1
            company.name,
            company.slug
         );
      }

      console.log("Finished processing companies");
   } catch (err) {
      console.error("Error processing JSON file:", err);
   } finally {
      await prisma.$disconnect(); // Ensure that Prisma connection is closed
   }
}

// Run the JSON data processing function
processJSONData();
