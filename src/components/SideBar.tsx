import Image from "next/image";
import Calendar from "./subcomponent/Calender";

const SideBar = () => {
   return (
      <section className="hidden lg:block  lg:w-[27%] 2xl:[25%] mr-2 text-prim1  ">
         <div className="bg-seco2 rounded-md">
            {/* profile section */}
            <ul className="p-1 flex ">
               <li className="w-fit h-fit bg-prim2 rounded-sm">
                  <Image
                     src={"/img/user.png"}
                     alt="user-pic"
                     width={"80"}
                     height={"80"}
                  />
               </li>
               <li className=" ml-2 [&>*]:block">
                  <span>name</span>
                  <span>@tag-name</span>
                  <span></span>
               </li>
            </ul>
         </div>
         <Calendar />
      </section>
   );
};

export default SideBar;
