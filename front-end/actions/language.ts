import { signIn } from "./auth";
import { DEFAULT_LOCALE } from "@/i18n/routing";
import { API_DATA_URL } from "@/constants/server";

export const getDefaultLanguage = async () => {
  const token = await signIn();

  const res = await fetch(`${API_DATA_URL}/api/user/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to change language");
  }

  const json = await res.json();

  return (json.data.language as string) ?? DEFAULT_LOCALE;
};

export const changeLanguage = async (language: string) => {
  const token = await signIn();

  const res = await fetch(`${API_DATA_URL}/api/user/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      language,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to change language");
  }

  return true;
};
