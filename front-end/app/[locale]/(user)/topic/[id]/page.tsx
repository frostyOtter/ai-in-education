import { Suspense } from "react";
import Topics, { TopicsLoader } from "../components/topics";
import { getCourses } from "@/actions/courses";
import { getTopics } from "@/actions/topics";
import { BackButton } from "@/components/back/button";

export default function TopicPage() {
  return (
    <div className="">
      <BackButton />

      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Homework Activities
          </h1>
          <p className="mt-2 text-gray-600">
            Choose an activity to practice your environment skills
          </p>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
        <Suspense fallback={<TopicsLoader />}>
          <Topics topics={getTopics()} />
        </Suspense>
      </div>
    </div>
  );
}
