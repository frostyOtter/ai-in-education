"use client";

import { useRouter } from "@/i18n/navigation";
import { EngFlag, ThaiFlag } from "../icon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useLocale } from "next-intl";
import { useTransition, useState } from "react";
import { LoaderCircle } from "lucide-react";

const LanguageButtons = () => {
  const router = useRouter();
  const locale = useLocale();
  const [activeLocale, setActiveLocale] = useState<string>(locale);
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (language: string) => {
    startTransition(async () => {
      await fetch("/api/change-language", {
        method: "POST",
        body: JSON.stringify({ language }),
      });
    });
  };

  const handleLanguageChange = async (language: string) => {
    await onSubmit(language);
    router.push(`/`, {
      locale: language,
    });
    setActiveLocale(language);
    router.refresh();
  };

  return (
    <Select value={activeLocale} onValueChange={handleLanguageChange}>
      <SelectTrigger
        size="default"
        className="h-max! w-max! rounded-full border-[3px] text-[32px] border-[#DDDEEB] bg-transparent px-8 py-4"
      >
        {isPending && (
          <LoaderCircle className="size-8 opacity-50 animate-spin" />
        )}
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="w-max! !rounded-[24px] shadow-md px-5 py-4">
        <SelectGroup>
          <SelectItem
            value="en"
            className="relative rounded-full py-4 px-3 text-[32px]"
          >
            <EngFlag className="size-10 mr-3" />
            English
          </SelectItem>
          <SelectItem
            value="th"
            className="relative rounded-full py-4 px-3 text-[32px]"
          >
            <ThaiFlag className="size-10 mr-3" />
            ภาษาไทย
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LanguageButtons;
