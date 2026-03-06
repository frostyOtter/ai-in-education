import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import CircularProgress from "@/components/course/progress";
import CourseLevel from "@/components/course/level";
import { Lesson } from "@/types/lesson";
import { use } from "react";
import { Link } from "@/i18n/navigation";
import { Course } from "@/types/course";

interface LessonsProps {
  course: Promise<Course | undefined>;
}

const Lessons = ({ course }: LessonsProps) => {
  const courseData = use(course);

  return (
    <div className="flex flex-col gap-4">
      {courseData?.lessons.map((lesson) => (
        <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
          <Card className={`cursor-pointer transition-all hover:shadow-md`}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {lesson.title}
                    </h3>
                    <CourseLevel level={lesson.level} />
                  </div>
                  <p className="text-gray-600">{lesson.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <CircularProgress
                    progress={lesson.progress}
                    completed={lesson.completed}
                  />
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default Lessons;
