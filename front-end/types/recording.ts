export enum RecordingState {
  IDLE = "idle",
  RECORDING = "recording",
  PROCESSING = "processing",
}

export enum SectionPayloadType {
  SECTION_END = "section_end",
  SECTION_CHANGE = "section_change",
}

export type SectionPayload = {
  type: SectionPayloadType;
  value: string;
};
