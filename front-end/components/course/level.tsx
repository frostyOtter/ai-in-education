import { Level } from "@/enum/course";
import { Badge } from "../ui/badge";
import { FC } from "react";

const levelColor = (level: Level) => {
  switch (level) {
    case Level.BEGINNER:
      return "bg-green-100 text-green-800";
    case Level.INTERMEDIATE:
      return "bg-blue-100 text-blue-800";
    case Level.UPPER_INTERMEDIATE:
      return "bg-yellow-100 text-yellow-800";
    case Level.ADVANCED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

type CourseLevelProps = {
  level: Level;
};

const CourseLevel: FC<CourseLevelProps> = ({ level }) => {
  return <Badge className={levelColor(level)}>{level}</Badge>;
};

export default CourseLevel;
