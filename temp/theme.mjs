import fs from "fs";

function removeSpacesAndSaveAsText(jsonFilePath, textFilePath) {
   // Read the JSON file
   fs.readFile(jsonFilePath, "utf8", (err, data) => {
      if (err) {
         console.error("Error reading JSON file:", err);
         return;
      }

      try {
         // Parse JSON data
         const jsonData = JSON.parse(data);

         // Convert JSON to a string without spaces
         const jsonString = JSON.stringify(jsonData, null, 0).replace(
            /\s/g,
            ""
         );

         // Save the modified content in a text file
         fs.writeFile(textFilePath, jsonString, "utf8", (err) => {
            if (err) {
               console.error("Error writing text file:", err);
               return;
            }
            console.log("Text file saved successfully!");
         });
      } catch (error) {
         console.error("Error parsing JSON:", error);
      }
   });
}

// Usage example:
const jsonFilePath = "./temp/theme.json"; // Replace with your JSON file path
const textFilePath = "./temp/themeoutput.txt"; // Replace with desired output text file path
removeSpacesAndSaveAsText(jsonFilePath, textFilePath);
