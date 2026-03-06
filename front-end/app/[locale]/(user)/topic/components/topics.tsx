"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { Topic } from "@/types/topic";
import { use } from "react";
import * as Icons from "@/components/icons";
import { cn } from "@/lib/utils";

type TopicsProps = {
  topics: Promise<Topic[]>;
};

const Topics = ({ topics }: TopicsProps) => {
  const topicsData = use(topics);

  if (topicsData.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No topics found matching your search.</p>
      </div>
    );
  }

  return topicsData.map((topic) => {
    if (!topic) return null;

    const Icon = Icons[topic.icon];

    return (
      <Link key={topic.slug} href={`/avatars/${topic.id}`}>
        <Card
          key={topic.slug}
          className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105"
        >
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-row gap-2 justify-between">
              <div
                className={cn(
                  "bg-slate-500 p-2 rounded-lg",
                  topic.config?.color
                )}
              >
                <Icon />
              </div>
              {topic.history && (
                <div className="text-lg font-semibold text-gray-900 group-hover:text-orange-600">
                  <Badge variant={"outline"} className="rounded-full">
                    {topic.history}
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600">
                {topic.title}
              </h3>
              <p className="text-sm text-gray-600">{topic.description}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  });
};

export const TopicsLoader = () => {
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

export default Topics;
