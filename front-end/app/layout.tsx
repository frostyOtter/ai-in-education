import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Metadata } from "next";
import { appConfig } from "@/app.config";
import { LocaleParams } from "@/types";
import { FC, PropsWithChildren } from "react";
import { appFont } from "@/app.font";
import "./globals.css";

type Params = Promise<LocaleParams>;

export const metadata: Metadata = {
  title: appConfig.title,
  description: appConfig.description,
};

type LocaleLayoutProps = {
  params: Params;
} & PropsWithChildren;

const RootLayout: FC<LocaleLayoutProps> = async ({ children, params }) => {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
    >
      <body className={appFont[locale]}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
