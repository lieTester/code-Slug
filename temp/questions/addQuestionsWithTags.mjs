import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createProblemsAndtopics() {
   try {
      // Read the problems and topics data from your JSON file
      const filePath = "./temp/questions/newDataQuestions.json"; // Replace with the path to your JSON file
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      let titleData = {};
      let id = 1;
      let index = 0;
      for (const item of data) {
         const { title, titleSlug, difficulty, topics, frontEndId } = item;

         const problem = await prisma.problem.findFirst({
            where: { titleSlug: titleSlug },
         });
         if (problem) {
            titleData[index] = title;
            index++;
            continue;
         }
         // Create the problem with the given data
         const createdProblem = await prisma.problem.create({
            data: {
               id: id++,
               title,
               description: "Add a description here", // You can customize this
               difficulty,
               frontEndId,
               titleSlug,
            },
         });

         // Find or create the topics and associate them with the problem
         for (const topicName of topics) {
            let topic = await prisma.topic.findFirst({
               where: { name: topicName },
            });

            if (!topic) {
               topic = await prisma.topic.create({
                  data: {
                     name: topicName,
                     slug: createSlug(topicName), // You can create a slug here
                  },
               });
            }

            // Associate the topic with the problem
            await prisma.problem.update({
               where: { id: createdProblem.id },
               data: {
                  topics: {
                     connect: { id: topic.id },
                  },
               },
            });
         }
      }

      // temp to check the total problems added
      const jsonString = JSON.stringify(titleData);
      // Specify the file path where you want to save the array
      const fileOutput = "./temp/questions/totalProblemsAddedInDb.json";
      // Write the JSON string to the file
      fs.writeFile(fileOutput, jsonString, (err) => {
         if (err) {
            console.error("Error writing to file:", err);
         } else {
            console.log("Array has been written to the file.");
         }
      });

      console.log("Problems and topics added to the database successfully");
   } catch (error) {
      console.error("Error adding problems and topics to the database:", error);
   } finally {
      await prisma.$disconnect();
   }
}

// Execute the function to add problems and topics to the database
createProblemsAndtopics();
