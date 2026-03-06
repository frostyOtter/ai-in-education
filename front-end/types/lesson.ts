import { Level } from "@/enum/course";

export type Lesson = {
  id: number;
  title: string;
  description: string;
  level: Level;
  progress: number;
  completed: boolean;
  tags: string[];
};
