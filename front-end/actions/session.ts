import "server-only";

import { cookies } from "next/headers";

export async function createSession(token: string, key: string) {
  await deleteSession(key);
  // 7 days.
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();

  cookieStore.set(key, token, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession(key: string) {
  const cookieStore = await cookies();
  cookieStore.delete(key);
}

export async function getSession(key: string) {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
}
