"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";

const Logo = () => {
  const { open } = useSidebar();
  return (
    <div className={cn("text-[#E15E1C] text-xl font-bold", !open && "text-xs")}>
      {open ? "LMS EDUCATION" : "LMS"}
    </div>
  );
};

export default Logo;
