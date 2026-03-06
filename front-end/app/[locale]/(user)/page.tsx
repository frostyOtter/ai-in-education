import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Suspense } from "react";
import { getCourses } from "@/actions/courses";
import Courses, { CoursesLoader } from "./components/courses";

export default function HomePage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Choose Your Topic
          </h1>
          <p className="mt-2 text-gray-600">
            Select a topic you'd like to explore and improve your English skills
          </p>
        </div>

        <div className="relative w-80 py-2.5 px-3">
          <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search topics..."
            className="pl-7 rounded-lg text-base"
          />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CoursesLoader />}>
          <Courses courses={getCourses()} />
        </Suspense>
      </div>
    </div>
  );
}
