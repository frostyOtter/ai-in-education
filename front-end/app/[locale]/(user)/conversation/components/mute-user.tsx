"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useTrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import { Mic, MicOff } from "lucide-react";
import { FC } from "react";

const MuteUser: FC<ButtonProps & { iconClass?: string }> = ({
  iconClass,
  ...props
}) => {
  const { toggle: toggleAudio, enabled: isAudioEnabled } = useTrackToggle({
    source: Track.Source.Microphone,
  });

  // Handle toggle with optional callback
  const handleToggle = async () => {
    try {
      await toggleAudio();
    } catch (error) {}
  };

  return (
    <Button
      {...props}
      onClick={handleToggle}
      title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
      aria-label={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
    >
      {isAudioEnabled ? (
        <Mic className={iconClass} />
      ) : (
        <MicOff className={iconClass} />
      )}
    </Button>
  );
};

export default MuteUser;
