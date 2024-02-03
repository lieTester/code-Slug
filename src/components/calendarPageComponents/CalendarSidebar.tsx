import React from "react";

function calederSidebar() {
   return (
      <section className="w-[100%] h-full md:w[35%] lg:w-[30%] 2xl:[25%] mr-2 text-prim1  mb-4 ">
         <div className="w-full h-full grid grid-rows-4 gap-2 [&>*]:bg-backg2">
            <div className="w-full h-full rounded-md py-2 px-2" id="highlight1">
               Study Plans
            </div>

            <div className="w-full h-full rounded-md py-2 px-2" id="highlight2">
               Study Plans
            </div>

            <div className="w-full h-full rounded-md py-2 px-2" id="highlight3">
               Study Plans
            </div>

            <div className="w-full h-full rounded-md py-2 px-2" id="highlight4">
               Study Plans
            </div>
         </div>
      </section>
   );
}

export default calederSidebar;
