"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAudioRecording } from "@/hooks/useAudioRecording";
import { StopCircleIcon, Mic, Plane } from "lucide-react";
import { RecordingState } from "@/types/recording";
import { useRef, useCallback } from "react";

interface RecordButtonProps {
  disabled?: boolean;
  className?: string;
}

export function RecordButton({ disabled, className }: RecordButtonProps) {
  const { recordingState, startRecording, stopRecording, isSupported } =
    useAudioRecording();

  const isHoldingRef = useRef(false);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleHoldStart = useCallback(async () => {
    if (disabled || recordingState !== RecordingState.IDLE) return;

    isHoldingRef.current = true;

    // Start recording after a short delay to prevent accidental recordings
    holdTimeoutRef.current = setTimeout(async () => {
      if (isHoldingRef.current) {
        await startRecording();
      }
    }, 100);
  }, [disabled, recordingState, startRecording]);

  const handleHoldEnd = useCallback(async () => {
    isHoldingRef.current = false;

    // Clear the timeout if recording hasn't started yet
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    // If currently recording, stop and send
    if (recordingState === RecordingState.RECORDING) {
      await stopRecording();
    }
  }, [recordingState, stopRecording]);

  // Unified event handlers for both mouse and touch
  const handlePressStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      handleHoldStart();
    },
    [handleHoldStart]
  );

  const handlePressEnd = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      handleHoldEnd();
    },
    [handleHoldEnd]
  );

  // Prevent default click behavior when using hold
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const getButtonContent = () => {
    switch (recordingState) {
      case RecordingState.RECORDING:
        return <StopCircleIcon className="h-4 w-4" />;
      case RecordingState.PROCESSING:
        return <Plane className="h-4 w-4 animate-pulse" />;
      default:
        return <Mic className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (recordingState) {
      case RecordingState.RECORDING:
        return "destructive" as const;
      case RecordingState.PROCESSING:
      default:
        return "secondary" as const;
    }
  };

  const getButtonText = () => {
    switch (recordingState) {
      case RecordingState.RECORDING:
      case RecordingState.PROCESSING:
        return "Release to send";
      default:
        return "Tap & hold to record your answer. Release to send answer";
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <Button
        variant={getVariant()}
        size="icon"
        onClick={handleClick}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
        disabled={disabled || recordingState === RecordingState.PROCESSING}
        className={cn(
          "relative transition-all duration-200 rounded-full select-none touch-none",
          recordingState === RecordingState.RECORDING &&
            "animate-pulse cursor-grabbing scale-110",
          recordingState === RecordingState.IDLE &&
            "hover:scale-105 active:scale-95",
          className
        )}
      >
        {getButtonContent()}
      </Button>
      <span
        className={cn(
          "text-xs text-muted-foreground transition-opacity duration-200",
          recordingState === RecordingState.PROCESSING && "opacity-50"
        )}
      >
        {getButtonText()}
      </span>
    </div>
  );
}
