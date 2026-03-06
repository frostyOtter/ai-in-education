import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useVoiceAssistant, VideoTrack } from "@livekit/components-react";
import { ComponentProps, FC } from "react";
import { RecordButton } from "./record-button";
import { Skeleton } from "@/components/ui/skeleton";

type AgentAudioTileProps = ComponentProps<"div">;

export const AgentAvatar: FC<AgentAudioTileProps> = ({ className }) => {
  const { videoTrack, audioTrack } = useVoiceAssistant();
  const { state } = useVoiceAssistant();

  if (state === "connecting") {
    return (
      <Card className={cn("p-0 rounded-xl h-max w-[300px] gap-0", className)}>
        <CardContent className="h-full aspect-[9/16] p-0 max-h-[300px]">
          <Skeleton className="h-full w-full rounded-xl rounded-b-none" />
        </CardContent>
      </Card>
    );
  }

  if (state === "disconnected") {
    return null;
  }

  return (
    <Card className={cn("p-0 rounded-xl w-[300px] h-max gap-0", className)}>
      <CardContent className="h-full aspect-[9/16] p-0 max-h-[300px]">
        {videoTrack && audioTrack ? (
          <VideoTrack
            trackRef={videoTrack}
            width={videoTrack?.publication.dimensions?.width ?? 0}
            height={videoTrack?.publication.dimensions?.height ?? 0}
            className="object-cover h-full w-full rounded-xl rounded-b-none"
          />
        ) : (
          <video
            src={"/emma.mp4"}
            autoPlay
            loop
            className="object-cover h-full w-full rounded-xl rounded-b-none"
          />
        )}
      </CardContent>
      <CardFooter className="bg-primary text-primary-foreground rounded-b-xl py-4">
        <RecordButton />
      </CardFooter>
    </Card>
  );
};
