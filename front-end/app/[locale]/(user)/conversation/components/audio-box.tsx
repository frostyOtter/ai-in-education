"use client";

import { cn } from "@/lib/utils";
import {
  BarVisualizerProps,
  useMaybeTrackRefContext,
  useMultibandTrackVolume,
} from "@livekit/components-react";
import { ComponentProps, FC, HTMLAttributes } from "react";

type AudioBoxProps = {
  barClassName?: string;
  barSize?: string;
} & BarVisualizerProps &
  ComponentProps<"div">;

export const AudioBox: FC<AudioBoxProps> = (props) => {
  const {
    trackRef,
    options,
    barCount,
    barClassName,
    barSize = "10px",
    ...rest
  } = props;
  let trackReference = useMaybeTrackRefContext();

  if (trackRef) {
    trackReference = trackRef;
  }

  const volumeBands = useMultibandTrackVolume(trackReference, {
    bands: barCount ?? 5,
    loPass: 100,
    hiPass: 200,
  });

  const minHeight = options?.minHeight ?? 10;
  const maxHeight = options?.maxHeight ?? 100;

  return (
    <div
      {...rest}
      className={cn(
        "relative flex w-max items-center justify-center gap-2",
        rest.className
      )}
    >
      {volumeBands.map((volume, index) => {
        const height = Math.min(
          maxHeight,
          Math.max(minHeight, volume * maxHeight + 5)
        );
        return (
          <div
            key={index}
            className={cn("rounded-full bg-primary", barClassName)}
            style={{
              height: height !== minHeight ? `${height}px` : barSize,
              width: barSize,
            }}
          />
        );
      })}
    </div>
  );
};
