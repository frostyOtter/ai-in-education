import "server-only";

import { LIVEKIT_API_KEY, LIVEKIT_API_SECRET } from "@/constants/server";
import {
  AccessToken,
  type AccessTokenOptions,
  type VideoGrant,
} from "livekit-server-sdk";

export const createParticipantToken = async (
  userInfo: AccessTokenOptions,
  roomName: string
) => {
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    ...userInfo,
    ttl: "15m",
  });

  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);

  return at.toJwt();
};
