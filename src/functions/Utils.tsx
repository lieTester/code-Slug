import { ProblemsProp } from "@/types";
import { BsCheck2Circle, BsCalendarMinus } from "react-icons/bs";
import { IoIosCodeWorking } from "react-icons/io";
////////////////////////////////////////////////////////////////////////
//////////////////////////////// UTILS
////////////////////////////////////////////////////////////////////////
export const difficultyColor = (val: String) => {
   if (val === "Easy") return "text-easy";
   else if (val === "Medium") return "text-medium";
   return "text-hard";
};
export const statusColor = (val: String) => {
   if (val === "solved") return "text-easy";
   else if (val === "attempted") return "text-medium";
   return "text-prim1";
};

export const giveMyStatus = (status: string) => {
   if (status === "solved")
      return (
         <BsCheck2Circle
            className={`mr-1 text-[18px]  ${statusColor(status)}`}
         />
      );
   else if (status === "attempted")
      return (
         <IoIosCodeWorking
            className={`mr-1 text-[20px]  ${statusColor(status)}`}
         />
      );
   return <BsCalendarMinus className={`mr-1  ${statusColor(status)}`} />;
};

export const handleDrop = (
   e: React.DragEvent<HTMLDivElement>,
   targetList: ProblemsProp[],
   setTargetList: React.Dispatch<React.SetStateAction<ProblemsProp[]>>,
   previousList: ProblemsProp[],
   setPreviousList: React.Dispatch<React.SetStateAction<ProblemsProp[]>>
) => {
   e.preventDefault();
   const droppedProblem = JSON.parse(
      e.dataTransfer.getData("text/plain")
   ) as ProblemsProp;

   // Check if the problem already exists in the targetList
   if (targetList.some((p) => p.id === droppedProblem.id)) {
      return;
   }

   // Remove the problem from the source list (previousList)
   const updatedPreviousList = previousList.filter(
      (p) => p.id !== droppedProblem.id
   );
   setPreviousList(updatedPreviousList);

   // Add the problem to the target list (targetList)
   setTargetList([...targetList, droppedProblem]);
};
