import { defineRouting } from "next-intl/routing";

export const DEFAULT_LOCALE = "en";

export const LOCALES = ["en", "th"];

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});
