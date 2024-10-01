import fs from "fs";
import { PrismaClient } from "@prisma/client";

async function main() {
   const prisma = new PrismaClient();

   try {
      // Read topics from topic.json
      const topicFilePath = "./temp/topic/topics.json"; // Replace with the path to your JSON file
      const topicsData = fs.readFileSync(topicFilePath, "utf-8");
      const topicsArray = JSON.parse(topicsData);
      await prisma.topic.deleteMany({});
      // Add topics to the database
      let id = 1;
      for (const topic of topicsArray) {
         const { name, slug } = topic;
         await prisma.topic.create({
            data: {
               id: id++,
               name,
               slug,
            },
         });
      }

      console.log("topics added to the database successfully");
   } catch (error) {
      console.error("Error adding topics to the database:", error);
   } finally {
      await prisma.$disconnect();
   }
}

main().catch(console.error);
