import { TrackReference, useLocalParticipant } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useMemo } from "react";

export function useLocalTrackRef(source: Track.Source) {
  const { localParticipant } = useLocalParticipant();
  const publication = localParticipant.getTrackPublication(source);
  const trackRef = useMemo<TrackReference | undefined>(
    () =>
      publication
        ? { source, participant: localParticipant, publication }
        : undefined,
    [source, publication, localParticipant]
  );
  return trackRef;
}
