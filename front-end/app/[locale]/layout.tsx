import { LocaleParams } from "@/types";
import { FC, PropsWithChildren } from "react";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

type Params = Promise<LocaleParams>;

type LocaleLayoutProps = {
  params: Params;
} & PropsWithChildren;

const LocaleLayout: FC<LocaleLayoutProps> = async ({ children, params }) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default LocaleLayout;
