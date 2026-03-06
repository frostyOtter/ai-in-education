"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

const LessonLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const handleCloseLesson = () => {
    router.back();
  };

  return (
    <aside className="w-1/4 relative">
      <Button
        size={"icon"}
        variant={"ghost"}
        className="absolute top-2 right-2 rounded-full"
        onClick={handleCloseLesson}
      >
        <X />
      </Button>
      {children}
    </aside>
  );
};

export default LessonLayout;
