import { cn } from "@/lib/utils";
import type { FC, HTMLAttributes } from "react";

const Container: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        "flex h-dvh w-full flex-col items-center justify-center bg-[#FAF7F5]",
        props.className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
