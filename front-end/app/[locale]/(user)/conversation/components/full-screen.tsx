"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { FC, useEffect, useRef } from "react";
import { Maximize, Minimize } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "usehooks-ts";
import { FULL_SCREEN_KEY } from "@/constants/client";

const FullScreenButton: FC<ButtonProps> = (props) => {
  const [isFullScreen, setIsFullScreen] = useLocalStorage(
    FULL_SCREEN_KEY,
    false
  );
  const documentRef = useRef<Document>(null);

  const toggleFullScreen = () => {
    if (documentRef.current) {
      if (isFullScreen) {
        documentRef.current.exitFullscreen();
        setIsFullScreen(false);
      } else {
        documentRef.current.documentElement.requestFullscreen();
        setIsFullScreen(true);
      }
    }
  };

  useEffect(() => {
    documentRef.current = window.document;
  }, []);

  return (
    <Button
      {...props}
      variant="ghost"
      size="icon"
      onClick={toggleFullScreen}
      className={cn("rounded-full size-[86px]", props.className)}
    >
      {isFullScreen ? (
        <Minimize className="size-8" />
      ) : (
        <Maximize className="size-8" />
      )}
    </Button>
  );
};

export default FullScreenButton;
