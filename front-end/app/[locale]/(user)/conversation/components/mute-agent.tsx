"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { NEXT_DEFAULT_VOLUME } from "@/constants/client";
import { ErrorHelper } from "@/lib/error-helper";
import { useVoiceAssistant } from "@livekit/components-react";
import { Track } from "livekit-client";
import { Volume1Icon, Volume2Icon, VolumeX } from "lucide-react";
import { FC, useState } from "react";

const MuteAgent: FC<ButtonProps & { iconClass?: string }> = ({
  iconClass,
  ...props
}) => {
  const { agent } = useVoiceAssistant();
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);

  const onMute = () => {
    try {
      if (agent) {
        const newIsMuted = !isMuted;
        if (newIsMuted) {
          agent?.setVolume(0, Track.Source.Microphone);
        } else if (volume === 0 && !newIsMuted) {
          agent?.setVolume(NEXT_DEFAULT_VOLUME / 100, Track.Source.Microphone);
          onVolumeChange([NEXT_DEFAULT_VOLUME]);
        } else {
          agent?.setVolume(volume / 100, Track.Source.Microphone);
        }
        setIsMuted(newIsMuted);
      }
    } catch (error) {
      ErrorHelper(error);
    }
  };

  const onVolumeChange = (value: number[]) => {
    try {
      const currentVolume = value[0];
      if (agent && currentVolume > 0) {
        agent?.setVolume(currentVolume / 100, Track.Source.Microphone);
      } else {
        agent?.setVolume(0, Track.Source.Microphone);
      }
      setVolume(currentVolume);
      setIsMuted(currentVolume === 0);
    } catch (error) {
      ErrorHelper(error);
    }
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      <Button {...props} onClick={onMute} disabled={!agent}>
        {isMuted || volume === 0 ? (
          <VolumeX className={iconClass} />
        ) : volume > 50 ? (
          <Volume2Icon className={iconClass} />
        ) : (
          <Volume1Icon className={iconClass} />
        )}
      </Button>
      <div className="w-16">
        <Slider
          value={[volume]}
          max={100}
          step={1}
          onValueChange={onVolumeChange}
          disabled={!agent}
        />
      </div>
    </div>
  );
};

export default MuteAgent;
