import fs from "fs";

function quetionList() {
   // Read the data from the old JSON file
   const rawData = fs.readFileSync("./temp/questions/questions.json", "utf-8");
   const oldData = JSON.parse(rawData);

   // Extract the desired fields from the old data
   const newData = oldData.questions.map((question) => ({
      acRate: question.acRate,
      frontendQuestionId: question.frontendQuestionId,
      status: question.status,
      difficulty: question.difficulty,
      title: question.title,
      titleSlug: question.titleSlug,
      topicTags: question.topicTags.map((tags) => tags.name),
   }));

   // Write the extracted data to a new JSON file
   fs.writeFileSync(
      "./temp/questions/newDataQuestions.json",
      JSON.stringify(newData, null, 2)
   );
}
// quetionList();

function extractTags() {
   function createSlug(tagName) {
      // Replace spaces with hyphens and make it lowercase
      return tagName.toLowerCase().replace(/ /g, "-");
   }

   // Read the file content as a string
   const filePath = "./tag/tags.txt"; // Replace with the path to your file
   const fileContent = fs.readFileSync(filePath, "utf-8");

   // Split the content into an array of strings (tags) and create slugs
   const tagsArray = fileContent
      .split("\n")
      .map((tag) => tag.trim()) // Remove any leading/trailing white spaces
      .filter((tag) => tag) // Remove any empty lines
      .map((tag) => ({
         name: tag,
         slug: createSlug(tag),
      }));

   // Convert the array of tags to JSON and write it to a new file
   const jsonTags = JSON.stringify(tagsArray, null, 2);
   const outputFilePath = "./tag/tags.json"; // Replace with the desired output file path

   fs.writeFileSync(outputFilePath, jsonTags);

   console.log(`Tags and slugs extracted and saved to ${outputFilePath}`);
}
// extractTags();

const filterStriverList = () => {
   const rawData = fs.readFileSync(
      "./temp/questions/questions-striver.json",
      "utf-8"
   );
   const jsonData = JSON.parse(rawData);
   const extractedData = [];

   // Iterate through the JSON data and extract the required information
   jsonData.forEach((item) => {
      item.topics.forEach((topic) => {
         const tagsArray = topic.tags.split(",").map((tag) => tag.trim());
         let titleSlug = "";

         if (topic.p2_link) {
            const p2LinkParts = topic.p2_link.split("/");
            titleSlug = p2LinkParts[p2LinkParts.length - 2];
         } else {
            titleSlug = topic["title"].toLowerCase().split(" ").join("-");
         }

         let dayTitle = topic.day_title.split(" and ").map((tag) => tag.trim());

         extractedData.push({
            p1_link: topic.p1_link,
            p2_link: topic.p2_link,
            Companytags: tagsArray,
            difficulty: "Medium",
            title: topic.title,
            titleSlug,
            topicTags: dayTitle,
         });
      });
   });
   // Write the extracted data to a new JSON file
   fs.writeFileSync(
      "./temp/questions/newDataQuestions-striver.json",
      JSON.stringify(extractedData, null, 2)
   );
   console.log(extractedData);
};

// filterStriverList();
