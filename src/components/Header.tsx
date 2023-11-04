// react, next
import { useContext, FC, useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

// components
import Logo from "@/components/subcomponent/Logo";
import Login from "@/components/subcomponent/Login";
// context
import { SessionContext } from "@/context/SessionContext";
import Link from "next/link";

const Header: FC<{}> = () => {
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;

   // to get session
   const [showLoginOverlay, setShowLoginOverlay] = useState(false);
   useEffect(() => {
      if (session?.user) {
         setShowLoginOverlay(false);
      }
   }, [session]);

   return (
      <>
         <section className="fixed w-full h-[7%] flex justify-center border-b-[0.5px] border-seco2 z-[30] bg-clip-padding backdrop-filter backdrop-blur-sm">
            <div className="w-[95%] lg:w-[90%] 2xl:w-[80%]   flex  items-center justify-between  !important  text-prim1 z-20 ">
               <Link
                  href={process.env.NEXTAUTH_URL || "http://localhost:3000/"}
               >
                  <Logo />
               </Link>

               <div className="absolute right-0 md:relative  p-1  flex justify-center [&>*]:ml-4">
                  {session?.user?.image ? (
                     <>
                        <span className="flex items-center text-center text-prim2 text-xs px-2 border-seco2 border-[1px] rounded-md">
                           <Link href="#">Mark Calender</Link>
                        </span>
                        <span className="flex items-center text-center text-prim2 text-xs px-2 border-seco2 border-[1px] rounded-md">
                           <Link href="/lists-landing">Create-Lists</Link>
                        </span>
                        <span className="rounded-full [&:hover>ul]:visible [&:hover>ul]:opacity-100 hover:bg-seco2">
                           <Image
                              src={session?.user?.image}
                              alt="user profile image"
                              width={30}
                              height={30}
                              className="rounded-full "
                           />
                           <ul className="absolute -bottom-[30px] right-0  invisible transition-all duration-100 ease-linear cursor-pointer">
                              <li className="p-1 before:absolute before:right-3 before:top-[3px] before:rotate-45 before:w-[12px] before:h-[12px]   before:bg-extra2 before:rounded-sm "></li>
                              <li
                                 className="text-xs font-normal bg-extra2 text-seco1 rounded-sm p-1 px-3"
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
                        onClick={() => setShowLoginOverlay(!showLoginOverlay)}
                        className="bg-seco1 px-3 py-1 text-base font-baloo rounded-sm hover:bg-seco2 ease-linear"
                     >
                        Log In
                     </button>
                  )}
               </div>
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
