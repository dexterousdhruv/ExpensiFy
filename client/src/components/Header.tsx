import { Button } from "@/components/ui/button";
import {  MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";

export default function Header() {
  const navigate = useNavigate();
  const isAboveMobileScreens = useMediaQuery("(min-width: 640px)");
  return (
    <>
      <header className="bg-background/95 backdrop-blur border-b border-gray-200 shadow-sm ">
        <div className="container flex items-center justify-between gap-4 h-12 sm:h-16 mx-auto px-5 lg:px-0 ">
          {/* Logo (Left) */}
          <div className="flex items-center">
            <a href="/" className="font-bold text-lg w-full">
              <img
                src={"/logo.svg"}
                alt={"Logo"}
                className="w-40 hidden sm:block"
              />
              <img src={"/icon.svg"} alt={"Logo"} className="w-10 sm:hidden" />
            </a>
          </div>

          {/* Login Button (Right) */}
          <nav className="flex items-center space-x-4">
            <Button
              size={isAboveMobileScreens ? "lg" : "sm"}
              className="font-geist focus:ring-2 focus:ring-zinc-500 text-sm"
              onClick={() => navigate("/sign-in")}
            >
              <span>Sign In</span>
              <MoveRight className="text-white hidden sm:block" />
            </Button>
          </nav>
        </div>
      </header>
    </>
  );
}
