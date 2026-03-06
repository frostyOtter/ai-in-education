"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  useLocalParticipant,
  useRoomContext,
  useVoiceAssistant,
} from "@livekit/components-react";
import { RecordingState } from "@/types/recording";
import { ErrorHelper } from "@/lib/error-helper";

interface UseAudioRecordingReturn {
  recordingState: RecordingState;
  recordingDuration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  cancelRecording: () => Promise<void>;
  isSupported: boolean;
}

type useAudioRecordingState = {
  recordingState: RecordingState;
  recordingDuration: number;
};

export function useAudioRecording(): UseAudioRecordingReturn {
  const [{ recordingDuration, recordingState }, setState] =
    useState<useAudioRecordingState>({
      recordingState: RecordingState.IDLE,
      recordingDuration: 0,
    });
  const { agent } = useVoiceAssistant();

  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { localParticipant } = useLocalParticipant();
  const room = useRoomContext();

  const isSupported =
    typeof window !== "undefined" &&
    "navigator" in window &&
    "mediaDevices" in navigator &&
    Boolean(localParticipant) &&
    Boolean(room) &&
    Boolean(agent);

  const updateDuration = useCallback(() => {
    if (startTimeRef.current > 0) {
      setState((prev) => ({
        ...prev,
        recordingDuration: Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        ),
      }));
    }
  }, []);

  const startRecording = useCallback(async () => {
    const isNotAllowed =
      !isSupported ||
      recordingState !== RecordingState.IDLE ||
      !localParticipant;

    if (isNotAllowed) return;

    try {
      if (!agent) {
        ErrorHelper("useAudioRecording", "No agent participant found");
        return;
      }

      await localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: "start_turn",
        payload: "",
      });

      startTimeRef.current = Date.now();
      setState((prev) => ({
        ...prev,
        recordingDuration: 0,
        recordingState: RecordingState.RECORDING,
      }));

      // Start duration timer
      durationIntervalRef.current = setInterval(updateDuration, 1000);
    } catch (error) {
      ErrorHelper(
        "useAudioRecording",
        "Error starting recording via RPC:",
        error
      );
      setState((prev) => ({
        ...prev,
        recordingState: RecordingState.IDLE,
      }));
    }
  }, [isSupported, recordingState, localParticipant, updateDuration]);

  const stopRecording = useCallback(async () => {
    const isNotAllowed =
      recordingState !== RecordingState.RECORDING ||
      !localParticipant ||
      !agent;
    if (isNotAllowed) return;

    try {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      setState((prev) => ({
        ...prev,
        recordingState: RecordingState.PROCESSING,
      }));

      await localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: "end_turn",
        payload: "",
      });

      setState((prev) => ({
        ...prev,
        recordingState: RecordingState.IDLE,
      }));
    } catch (error) {
      ErrorHelper(
        "useAudioRecording",
        "Error stopping recording via RPC:",
        error
      );
      setState((prev) => ({
        ...prev,
        recordingState: RecordingState.IDLE,
      }));
    }
  }, [recordingState, localParticipant, agent]);

  const cancelRecording = useCallback(async () => {
    const isNotAllowed =
      recordingState !== RecordingState.RECORDING ||
      !localParticipant ||
      !agent;
    if (isNotAllowed) return;

    try {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      await localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: "cancel_turn",
        payload: "",
      });

      setState((prev) => ({
        ...prev,
        recordingState: RecordingState.IDLE,
      }));
    } catch (error) {
      ErrorHelper(
        "useAudioRecording",
        "Error cancelling recording via RPC:",
        error
      );
      setState((prev) => ({
        ...prev,
        recordingState: RecordingState.IDLE,
      }));
    }
  }, [recordingState, localParticipant]);

  // const formatDuration = (seconds: number) => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins}:${secs.toString().padStart(2, "0")}`;
  // };

  return {
    recordingState,
    recordingDuration,
    startRecording,
    stopRecording,
    cancelRecording,
    isSupported,
  };
}
