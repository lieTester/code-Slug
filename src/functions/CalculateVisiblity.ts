type Tag = {
   name: string;
};

export const calculateVisibleTagsCount = (tags: string[], maxWidth: number) => {
   let visibleWidth = 0;
   const remainingTags = [...tags]; // Create a copy of the tags array

   for (let i = 0; i < tags.length; i++) {
      const tagWidth = tags[i].length * 8; // Adjust 8 based on your font size and styling
      if (visibleWidth + tagWidth <= maxWidth) {
         visibleWidth += tagWidth;
         remainingTags.shift();
      } else {
         break;
      }
   }

   return {
      visibleCount: tags.length - remainingTags.length,
      remainingCount: remainingTags.length,
   };
};
