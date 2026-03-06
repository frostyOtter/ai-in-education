import { useEffect } from "react";
import { LogLevel, setLogLevel } from "livekit-client";
import { useRoomContext } from "@livekit/components-react";
import { IS_DEVELOPMENT } from "@/constants";

export const useDebugMode = ({ logLevel }: { logLevel?: LogLevel } = {}) => {
  const room = useRoomContext();

  useEffect(() => {
    if (IS_DEVELOPMENT) {
      setLogLevel(logLevel ?? "debug");
    }

    // @ts-expect-error
    window.__lk_room = room;

    return () => {
      // @ts-expect-error
      window.__lk_room = undefined;
    };
  }, [room, logLevel]);
};
