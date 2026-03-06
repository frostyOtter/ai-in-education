import { Locale } from "next-intl";
import {
  Plus_Jakarta_Sans,
  Noto_Sans_Mono,
  Noto_Sans_Thai,
} from "next/font/google";

export const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese", "latin-ext"],
  variable: "--font-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const fontSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const fontMono = Noto_Sans_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const appFont: Record<Locale, string> = {
  en: `${fontSans.variable} ${fontMono.variable}`,
  th: `${fontSansThai.variable} ${fontMono.variable}`,
};
