import Image from "next/image";

const Logo = () => {
   return (
      <>
         <div className="sm:w-fit flex  items-center ">
            <Image
               className="w-5 h-5 md:w-10 md:h-10"
               src={"/img/drive.png"}
               alt="drive-img"
               width={"40"}
               height={"40"}
            />
            <label className=" font-sofiaPro text-prim1 text-[15px] ml-2 md:text-[22px] md:ml-4">
               Code-Slug
            </label>
         </div>
      </>
   );
};

export default Logo;
