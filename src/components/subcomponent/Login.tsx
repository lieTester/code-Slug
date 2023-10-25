"use client";
import { signIn } from "next-auth/react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

const Login: React.FC<{ open: boolean; onClose: () => void }> = ({
   open,
   onClose,
}) => {
   const handleSignIn = (provider: string) => {
      signIn(provider, {
         callbackUrl: process.env.NEXTAUTH_URL,
      });
   };

   return (
      <div
         className={`${
            open ? "fixed" : "hidden"
         }   top-0 left-0 inset-0 flex items-center justify-center z-10  fade`}
      >
         <div
            onClick={onClose}
            className="absolute w-full h-full  -z-10 bg-clip-padding backdrop-filter backdrop-blur-md "
         ></div>
         <div className="relative p-2  text-center w-full sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] max-w-screen-sm mx-2 z-20">
            <Image
               src="/img/logo.png"
               alt="Google Drive"
               width={100}
               height={100}
               className="mx-auto mb-4 rotate-180"
            />
            <h2 className="text-3xl font-semibold mb-6 text-prim2">
               Welcome Back to Code-Slug!
            </h2>
            <p className="text-prim1 text-sm mb-6">
               Sign in with your social account
            </p>
            <button
               onClick={() => handleSignIn("google")}
               className="px-6 py-1 space-x-2 mb-3 mx-auto rounded-full text-prim2 font-medium outline outline-1   hover:ring-2 hover:ring-[#616161] hover:-outline-offset-[.5px]  hover:outline-[#616161] transition-all duration-300"
            >
               <FcGoogle className="inline text-[18px] mb-1 mr-1" /> Sign in
               with Google
            </button>
            <br />
            <button
               onClick={() => handleSignIn("github")}
               className="px-6 py-1 space-x-2 mx-auto rounded-full text-prim2 font-medium outline outline-1   hover:ring-2 hover:ring-[#616161] hover:-outline-offset-[.5px]  hover:outline-[#616161] transition-all duration-300"
            >
               <FaGithub className="inline text-[18px] mb-1 mr-1" /> Sign in
               with GitHub
            </button>
         </div>
      </div>
   );
};

export default Login;
