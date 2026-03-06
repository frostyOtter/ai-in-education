"use client";

import { ConnectionState, Room, RoomEvent } from "livekit-client";
import { ErrorHelper } from "@/lib/error-helper";
import { FC, useEffect, useMemo, useState } from "react";
import { IS_DEVELOPMENT } from "@/constants";
import { RoomAudioRenderer, RoomContext } from "@livekit/components-react";
import { Session } from "./session";
import { toast } from "sonner";
import useConnectionDetails from "@/hooks/useConnectionDetails";
import { SectionPayload, SectionPayloadType } from "@/types/recording";
import { useSectionStore } from "@/store/section";

type SpeechRoomProps = {
  id: string;
};

export const SpeechRoom: FC<SpeechRoomProps> = ({ id }) => {
  const [sessionStarted, setSessionStarted] = useState(true);
  const { connectionDetails, loading } = useConnectionDetails();
  const { setActiveSection, setEndSection } = useSectionStore();

  const room = useMemo(() => new Room(), []);

  useEffect(() => {
    const onDisconnected = () => {
      setSessionStarted(false);
    };

    const onMediaDevicesError = (error: Error) => {
      if (IS_DEVELOPMENT) {
        console.log(`${error.name}: ${error.message}`);
      }
      toast.error("Encountered an error with your media devices");
    };

    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);
    room.on(RoomEvent.Disconnected, onDisconnected);

    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
    };
  }, [room]);

  useEffect(() => {
    if (
      sessionStarted &&
      connectionDetails &&
      room.state === ConnectionState.Disconnected
    ) {
      Promise.allSettled([
        room.localParticipant.setMicrophoneEnabled(true),
        room.connect(
          connectionDetails.serverUrl,
          connectionDetails.participantToken
        ),
      ]).catch((error) => {
        ErrorHelper(error);
      });
    }
  }, [room, sessionStarted, connectionDetails]);

  useEffect(() => {
    if (room) {
      room.registerRpcMethod(
        "client.update_lesson_state",
        async ({ payload }) => {
          const section = JSON.parse(payload) as SectionPayload;
          switch (section.type) {
            case SectionPayloadType.SECTION_END:
              setEndSection(true);
              break;
            case SectionPayloadType.SECTION_CHANGE:
              setActiveSection(section.value);
              break;
          }
          return "Success";
        }
      );
    }

    return () => {
      room.unregisterRpcMethod("client.update_lesson_state");
    };
  }, [room]);

  useEffect(() => {
    return () => {
      room.disconnect();
    };
  }, [room]);

  return (
    <RoomContext.Provider value={room}>
      <RoomAudioRenderer />
      <Session
        room={room}
        sessionStarted={sessionStarted && !loading}
        disabled={!sessionStarted && loading}
        id={id}
      />
    </RoomContext.Provider>
  );
};
