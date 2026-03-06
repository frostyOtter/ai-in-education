"use client";

import useChatAndTranscription from "@/hooks/useChatAndTranscription";
import {
  ComponentProps,
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatInput from "./chat-input";
import { useChat } from "@livekit/components-react";
import { ENABLE_CHAT_INPUT } from "@/constants/client";

type TranscriptsProps = ComponentProps<"div">;

const MessageContent: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {children?.toString()}
    </ReactMarkdown>
  );
};

const Transcripts: FC<TranscriptsProps> = ({ ...props }) => {
  const { messages } = useChatAndTranscription();
  const messRef = useRef<HTMLDivElement>(null);
  const { send: onSend } = useChat();

  useEffect(() => {
    if (messages) {
      messRef.current?.scrollTo({
        top: messRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, messRef]);

  return (
    <div {...props} className={props.className}>
      <div
        ref={messRef}
        className="flex flex-col gap-2 overflow-y-scroll h-[calc(100dvh-30dvh)] w-full no-scrollbar"
      >
        {messages?.length > 0 &&
          messages?.map((m) => {
            const isAgent = m.from?.identity.indexOf("agent") !== -1;
            if (isAgent) {
              return <AgentMessage key={m.id} message={m.message} />;
            }
            return <UserMessage key={m.id} message={m.message} />;
          })}
      </div>
      {ENABLE_CHAT_INPUT && <ChatInput onSend={onSend} />}
    </div>
  );
};

const UserMessage = ({ message }: { message: string }) => {
  return (
    <div className="group flex w-full flex-col gap-1 p-2 rounded-lg items-end">
      <div className="bg-white shadow rounded-lg p-2 text-right">
        <MessageContent>{message}</MessageContent>
      </div>
    </div>
  );
};

const AgentMessage = ({ message }: { message: string }) => {
  return (
    <div className="group flex w-full flex-col gap-1 p-2 rounded-lg items-start">
      <MessageContent>{message}</MessageContent>
    </div>
  );
};

export default Transcripts;
