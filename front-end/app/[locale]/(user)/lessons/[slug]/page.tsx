import { BackButton } from "@/components/back/button";
import { TreePine } from "lucide-react";
import Lessons from "./components/lessons";
import { getLessons } from "@/actions/lesson";
import { getLessonById } from "@/actions/activity";
import { getCourseBySlug, getCourses } from "@/actions/courses";
import { notFound } from "next/navigation";
import * as Icons from "@/components/icons";
import CourseHeader from "./components/course-header";

type PageParams = {
  params: Promise<{ slug: string }>;
};

const LessonsPage = async ({ params }: PageParams) => {
  const { slug } = await params;

  const course = getCourseBySlug(slug);

  if (!course) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <BackButton />
      </div>

      <CourseHeader course={course} />

      {/* Lessons List */}
      <div className="flex flex-col gap-4">
        <Lessons course={course} />
      </div>
    </div>
  );
};

export default LessonsPage;
