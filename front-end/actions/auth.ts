import { isValidToken } from "@/lib/token";
import { createSession, getSession } from "./session";
import {
  API_DATA_URL,
  LIVEKIT_EMAIL,
  LIVEKIT_PASSWORD,
  SESSION_KEY,
} from "@/constants/server";

export const signIn = async (): Promise<string> => {
  const token = await getSession(SESSION_KEY);

  if (token && (await isValidToken(token))) {
    return token;
  }

  const loginRes = await fetch(`${API_DATA_URL}/api/auth/user/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: LIVEKIT_EMAIL,
      password: LIVEKIT_PASSWORD,
    }),
  });

  if (!loginRes.ok) {
    throw new Error("Failed to login");
  }

  const res = await loginRes.json();

  await createSession(res.data.token, SESSION_KEY);

  return res.data.token;
};
