"use client";
// react, next
import { FC, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
// icons
import { CiViewList } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { TiHomeOutline } from "react-icons/ti";
// components
import Logo from "@/components/commonComponents/Logo";
import Login from "@/components/commonComponents/Login";

const Header: FC<{}> = () => {
   const { data: session } = useSession();
   const [showLoginOverlay, setShowLoginOverlay] = useState(false);
   useEffect(() => {
      if (session?.user) {
         setShowLoginOverlay(false);
      }
   }, [session]);

   return (
      <>
         <section className="fixed w-full h-[7%] flex justify-center border-b-[0.5px] border-bordr1 z-[30] bg-clip-padding backdrop-filter backdrop-blur-sm">
            <div className="w-[95%] lg:w-[90%] 2xl:w-[80%]   flex  items-center justify-between  !important  text-prim1 z-20 ">
               <Link href={"/"}>
                  <Logo />
               </Link>

               {session === undefined ? (
                  <div className="absolute right-0 md:relative  p-1  flex justify-center items-center [&>*]:ml-4 animate-pulse">
                     <span className="flex items-center h-[30px] text-center text-prim2 hover:text-prim1 text-xs px-2 border-bordr1 hover:border-white border-[2px] rounded-md">
                        <Link href="/" className="flex items-center">
                           <TiHomeOutline className="text-lg md:mr-1" />
                           <span className="hidden md:inline">Home</span>
                        </Link>
                     </span>
                     <span className="rounded-md w-8 h-[30px] md:w-[107px] border-bordr1 border-[2px]"></span>
                     <span className="rounded-md w-8 h-[30px] md:w-[120px] border-bordr1 border-[2px]"></span>
                     <svg
                        className="w-[32px] h-[32px]  text-gray-200 dark:text-gray-700"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                     >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                     </svg>
                  </div>
               ) : (
                  <div className="relative  p-1  flex justify-center [&>*]:ml-4">
                     <span className="flex items-center text-center text-prim2 hover:text-prim1 text-xs px-2 border-bordr1 hover:border-white border-[1px] rounded-md">
                        <Link href="/" className="flex items-center">
                           <TiHomeOutline className="text-lg md:mr-1" />
                           <span className="hidden md:inline">Home</span>
                        </Link>
                     </span>
                     {session?.user?.image ? (
                        <>
                           <span className=" flex items-center text-center text-prim2 hover:text-prim1 text-xs px-2 border-bordr1 hover:border-white border-[1px] rounded-md">
                              <Link
                                 href="/lists-landing"
                                 className="flex items-center"
                              >
                                 <CiViewList className="text-lg md:mr-1" />
                                 <span className="hidden md:inline">Lists</span>
                              </Link>
                           </span>
                           <span className="flex items-center text-center text-prim2 hover:text-prim1 text-xs px-2 border-bordr1 hover:border-white border-[1px] rounded-md">
                              <Link
                                 href="/calender-landing"
                                 className="flex items-center"
                              >
                                 <SlCalender className="text-base md:mr-1" />
                                 <span className="hidden md:inline">
                                    Calender
                                 </span>
                              </Link>
                           </span>
                           <span className="rounded-full [&:hover>ul]:visible [&:hover>ul]:opacity-100 hover:bg-front2">
                              <Image
                                 src={session?.user?.image}
                                 alt="user profile image"
                                 width={30}
                                 height={30}
                                 className="rounded-full "
                              />
                              <ul className="absolute -bottom-[30px] right-0  invisible transition-all duration-100 ease-linear cursor-pointer">
                                 <li className="p-1 before:absolute before:right-3 before:top-[3px] before:rotate-45 before:w-[12px] before:h-[12px]   before:bg-secod2 before:rounded-sm "></li>
                                 <li
                                    className="text-xs  bg-secod2 text-prim2 font-medium rounded-sm p-1 px-3"
                                    onClick={() => {
                                       signOut();
                                       console.log("signOut");
                                    }}
                                 >
                                    Signout
                                 </li>
                              </ul>
                           </span>
                        </>
                     ) : (
                        <button
                           onClick={() =>
                              setShowLoginOverlay(!showLoginOverlay)
                           }
                           className="bg-front1 px-3 py-1 text-base font-baloo rounded-sm hover:bg-front2 ease-linear"
                        >
                           Log In
                        </button>
                     )}
                  </div>
               )}
            </div>
         </section>
         <Login
            open={showLoginOverlay}
            onClose={() => {
               setShowLoginOverlay(!showLoginOverlay);
            }}
         />
      </>
   );
};

export default Header;
