"use client";

import { FC } from "react";

type LessonsLayoutProps = {
  children: React.ReactNode;
  lesson: React.ReactNode;
};

const LessonsLayout: FC<LessonsLayoutProps> = ({ children, lesson }) => {
  return (
    <div className="flex flex-row gap-2">
      <main className="mx-auto w-full p-6 flex-1 overflow-y-auto min-h-0 min-w-3/4">
        {children}
      </main>
      {lesson}
    </div>
  );
};

export default LessonsLayout;
