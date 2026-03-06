import * as Icons from "@/components/icons";
import { Lesson } from "./lesson";

export type Course = {
  slug: string;
  title: string;
  description: string;
  icon: keyof typeof Icons;
  lessons: Lesson[];
};
