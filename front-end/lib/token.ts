import { decodeJwt } from "jose";

export async function isValidToken(token: string) {
  try {
    const payload = decodeJwt(token);
    const expiresAt = payload?.exp;

    if (!expiresAt || expiresAt < Date.now()) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
