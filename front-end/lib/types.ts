import type { TranscriptionSegment } from "livekit-client";

export interface CombinedTranscription extends TranscriptionSegment {
  role: "assistant" | "user";
  receivedAtMediaTimestamp: number;
  receivedAt: number;
}

export interface AppConfig {
  pageTitle: string;
  pageDescription: string;
  companyName: string;

  suportsChatInput: boolean;
  suportsVideoInput: boolean;
  suportsScreenShare: boolean;

  logo: string;
  logoDark?: string;
  accentDark?: string;
}

export interface SandboxConfig {
  [key: string]:
    | { type: "string"; value: string }
    | { type: "number"; value: number }
    | { type: "boolean"; value: boolean }
    | null;
}
