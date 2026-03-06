import { createParticipantToken } from "@/actions/livekit";
import { LIVEKIT_URL } from "@/constants/server";
import { ErrorHelper } from "@/lib/error-helper";
import { ConnectionDetails } from "@/types";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET() {
  try {
    const participantName = "user";
    const participantIdentity = `voice_assistant_user_${Math.floor(
      Math.random() * 10_000
    )}`;
    const roomName = `voice_assistant_room_${Math.floor(
      Math.random() * 10_000
    )}`;
    const userInfo = {
      identity: participantIdentity,
      name: participantName,
    };

    // Generate participant token
    const token = await createParticipantToken(userInfo, roomName);

    // Return connection details
    const data: ConnectionDetails = {
      serverUrl: LIVEKIT_URL,
      roomName,
      participantToken: token,
      participantName,
    };

    const headers = new Headers({
      "Cache-Control": "no-store",
    });

    return NextResponse.json(data, { headers });
  } catch (error) {
    if (error instanceof Error) {
      ErrorHelper(error);
      return new NextResponse(error.message, { status: 500 });
    }
  }
}
