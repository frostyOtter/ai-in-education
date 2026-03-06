"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { Course } from "@/types/course";
import { use } from "react";
import * as Icons from "@/components/icons";

type CoursesProps = {
  courses: Promise<Course[]>;
};

const Courses = ({ courses }: CoursesProps) => {
  const coursesData = use(courses);

  if (coursesData.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No courses found matching your search.</p>
      </div>
    );
  }

  return coursesData.map((course) => {
    const Icon = Icons[course.icon];

    return (
      <Link key={course.slug} href={course.slug}>
        <Card
          key={course.slug}
          className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105"
        >
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-row gap-2 justify-between">
              <div className="bg-orange-500 text-white rounded-lg p-2">
                <Icon />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600">{course.description}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  });
};

export const CoursesLoader = () => {
  return Array.from({ length: 12 }, (_, index) => ({
    slug: `topic-${index + 1}`,
    title: `Topic ${index + 1}`,
    description: `Description for topic ${index + 1}`,
    icon: null,
    history: null,
  })).map((item) => {
    return (
      <Card
        key={item.slug}
        className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105"
      >
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-row gap-2 justify-between">
            <Skeleton className="h-12 w-12" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  });
};

export default Courses;
