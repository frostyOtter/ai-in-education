import type { FC, HTMLAttributes } from "react";
import "./ava.module.css";
import { cn } from "@/lib/utils";

const defaultSize = "w-[240px] h-[240px]";

const Ava: FC<HTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <div
      {...props}
      className={cn(
        "relative overflow-hidden rounded-full",
        defaultSize,
        props.className
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-0 rounded-full outline-5 outline-gray-300",
          defaultSize
        )}
      />
      <div
        className={cn(
          "absolute top-0 left-0 rounded-full bg-gray-300",
          defaultSize
        )}
      />
      {/* Green blob */}
      <div
        className={cn(
          "absolute animate-pulse rounded-full shadow-2xl blur-lg",
          defaultSize
        )}
        style={{
          width: "305.26px",
          height: "459.18px",
          left: "134.21px",
          top: "-130px",
          transform: "rotate(39deg)",
          transformOrigin: "top left",
          animationDuration: "2s",
          animationIterationCount: "infinite",
          animationDirection: "alternate",
        }}
      >
        <div className="h-full w-full animate-[colorShift_2s_infinite_alternate] rounded-full bg-green-100" />
      </div>

      {/* Yellow blob */}
      <div
        className={cn(
          "absolute animate-pulse rounded-full shadow-2xl blur-lg",
          defaultSize
        )}
        style={{
          width: "193.58px",
          height: "320.93px",
          left: "84.40px",
          top: "-112px",
          transform: "rotate(48deg)",
          transformOrigin: "top left",
          animationDuration: "2s",
          animationIterationCount: "infinite",
          animationDirection: "alternate",
          animationDelay: "0.5s",
        }}
      >
        <div className="h-full w-full animate-[colorShift2_2s_infinite_alternate_0.5s] rounded-full bg-yellow-100" />
      </div>

      {/* Red blob */}
      <div
        className={cn(
          "absolute animate-pulse rounded-full shadow-2xl blur-lg",
          defaultSize
        )}
        style={{
          width: "232.12px",
          height: "349.15px",
          left: "273.03px",
          top: "9px",
          transform: "rotate(39deg)",
          transformOrigin: "top left",
          animationDuration: "2s",
          animationIterationCount: "infinite",
          animationDirection: "alternate",
          animationDelay: "1s",
        }}
      >
        <div className="h-full w-full animate-[colorShift3_2s_infinite_alternate_1s] rounded-full bg-red-100" />
      </div>

      {/* Blue blob */}
      <div
        className={cn(
          "absolute animate-pulse rounded-full shadow-2xl blur-lg",
          defaultSize
        )}
        style={{
          width: "189.65px",
          height: "286.81px",
          left: "48.75px",
          top: "94px",
          transform: "rotate(39deg)",
          transformOrigin: "top left",
          animationDuration: "2s",
          animationIterationCount: "infinite",
          animationDirection: "alternate",
          animationDelay: "1.5s",
        }}
      >
        <div className="h-full w-full animate-[colorShift4_2s_infinite_alternate_1.5s] rounded-full bg-blue-100" />
      </div>
    </div>
  );
};

export default Ava;
