import Image from "next/image";
import { useContext } from "react";

import { SessionContext } from "@/context/SessionContext";
import Calendar from "@/components/commonComponents/Calender";
import ProblemsProgress from "@/components/commonComponents/Progress";
import WeekDayTopics from "@/components/_FirstPageComponents/problemTable/WeekDayTopics";

const SideBar = () => {
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;
   return (
      <section className="w-[100%] md:w[35%] lg:w-[30%] 2xl:[25%] mr-2 text-prim1  mb-4">
         {session?.user && (
            <div className="bg-backg2 rounded-md mb-4">
               {/* profile section */}
               <ul className="p-1 flex ">
                  <li className="w-fit h-fit bg-backg2 rounded-md overflow-hidden">
                     <Image
                        src={
                           session?.user
                              ? session?.user?.image
                              : "/img/user.png"
                        }
                        alt="user-pic"
                        width={"80"}
                        height={"80"}
                     />
                  </li>
                  <li className="font-baloo ml-2 [&>*]:block">
                     <span>{session?.user?.name}</span>
                     <span>@tag-name</span>
                     <span></span>
                  </li>
               </ul>
            </div>
         )}
         <ProblemsProgress />
         <WeekDayTopics />
         <Calendar />
      </section>
   );
};

export default SideBar;
