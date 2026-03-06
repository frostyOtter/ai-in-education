"use client";

import { ArrowLeft } from "lucide-react";
import { Button, ButtonProps } from "../ui/button";
import { useRouter } from "@/i18n/navigation";
import { FC, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export const BackButton: FC<PropsWithChildren & ButtonProps> = ({
  children,
  ...props
}) => {
  const router = useRouter();

  return (
    <Button
      {...props}
      variant="ghost"
      className={cn(
        "text-gray-600 hover:text-gray-800 rounded-full",
        props.className
      )}
      onClick={() => router.back()}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {children ?? "Back"}
    </Button>
  );
};
