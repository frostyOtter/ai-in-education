"use client";

import { AgentAvatar } from "./agent-avatar";
import { ConnectionState, Room } from "livekit-client";
import { useDebugMode } from "@/hooks/useDebug";
import { useChat, useLocalParticipant } from "@livekit/components-react";
import React, {
  ComponentProps,
  FC,
  useEffect,
  useState,
  useTransition,
} from "react";
import Transcripts from "./transcripts";
import { RotateCw } from "lucide-react";
import { useSectionStore } from "@/store/section";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type SessionProps = {
  disabled: boolean;
  sessionStarted: boolean;
  room: Room;
  id: string;
} & ComponentProps<"div">;

export const Session: FC<SessionProps> = (props) => {
  const { sessionStarted, room, id } = props;
  const { localParticipant } = useLocalParticipant();
  const [sections, setSections] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { activeSection, endSection, setEndSection } = useSectionStore();
  const defaultSections = [
    "Conversation Structures",
    "Greeting",
    "Topic Introduction",
    "Main Question",
    "Follow-up Questions",
  ];
  const { send: onSend } = useChat();

  useEffect(() => {
    if (room.state === ConnectionState.Connected) {
      localParticipant.setMicrophoneEnabled(true);
    }
  }, [localParticipant, room]);

  useDebugMode();

  useEffect(() => {
    if (activeSection) {
      setSections((prev) => [...prev, activeSection]);
    }
  }, [activeSection]);

  if (!sessionStarted || isPending) {
    return (
      <div className="h-dvh w-full flex flex-col justify-center items-center">
        <RotateCw className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-12 gap-10">
        <div className="flex flex-col gap-2 col-span-2">
          <h2
            className={cn(
              "text-base transition-colors duration-300 ease-in-out",
              defaultSections.find((section) => section === activeSection)
                ?.length === 0 && "font-semibold text-orange-500"
            )}
          >
            {"Conversation Structures"}
          </h2>

          <ul className="list-disc list-inside">
            {defaultSections.filter(c => c !== "Conversation Structures").map((section, index) => (
              <li
                key={index}
                className={cn(
                  "text-base transition-colors duration-300 ease-in-out",
                  activeSection === section && "font-semibold text-orange-500"
                )}
              >
                {section}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-7">
          <Transcripts className="border rounded-lg p-4" />
        </div>
        <div className="col-span-3 flex justify-center h-full">
          <AgentAvatar />
        </div>
      </div>

      {endSection && (
        <div className="mt-auto flex w-full justify-end gap-4">
          <Link
            href={"/"}
            className={buttonVariants({
              variant: "secondary",
              className:
                "border w-max rounded-full! text-lg! leading-6! h-auto! px-10!",
            })}
          >
            Choose Another Topic
          </Link>
          <Link
            href={`/topic/${id}`}
            className={buttonVariants({
              variant: "secondary",
              className:
                "border w-max rounded-full! text-lg! leading-6! h-auto! px-10!",
            })}
          >
            Learn From Begin
          </Link>
          <Link
            href={`/result/${id}`}
            className={buttonVariants({
              variant: "secondary",
              className:
                "bg-gradient-orange border w-max rounded-full! text-lg! leading-6! h-auto! px-10! text-white",
            })}
          >
            Finish Learning
          </Link>
        </div>
      )}
    </div>
  );
};
