import { use } from "react";
import { Course } from "@/types/course";
import * as Icons from "@/components/icons";

interface CourseHeaderProps {
  course: Promise<Course | undefined>;
}

const CourseHeader = ({ course }: CourseHeaderProps) => {
  const courseData = use(course);

  if (!courseData) {
    return null;
  }

  const Icon = Icons[courseData.icon];

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
        <Icon />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{courseData.title}</h1>
        <p className="text-gray-600">{courseData.description}</p>
      </div>
    </div>
  );
};

export default CourseHeader;
