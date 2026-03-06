import { Level } from "@/enum/course";
import { Lesson } from "@/types/lesson";

const defaultTags = [
  "Nature",
  "Weather",
  "Environment",
  "Pollution",
  "Recycle",
  "Climate",
];

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "Lesson 1",
    description:
      "Introduction to Nature and Climate. Basic concepts of the environment, nature, and weather.",
    level: Level.BEGINNER,
    progress: 100,
    completed: true,
    tags: defaultTags,
  },
  {
    id: 2,
    title: "Lesson 2",
    description:
      "Ecosystems and Habitats. Learn how living things interact with their environment.",
    level: Level.BEGINNER,
    progress: 75,
    completed: false,
    tags: defaultTags,
  },
  {
    id: 3,
    title: "Lesson 3",
    description:
      "Climate Change and Its Effects. Understand global warming, greenhouse gases, and consequences.",
    level: Level.INTERMEDIATE,
    progress: 0,
    completed: false,
    tags: defaultTags,
  },
  {
    id: 4,
    title: "Lesson 4",
    description:
      "Sustainability and Renewable Resources. Dive into eco-friendly practices and energy alternatives.",
    level: Level.UPPER_INTERMEDIATE,
    progress: 0,
    completed: false,
    tags: defaultTags,
  },
  {
    id: 5,
    title: "Lesson 5",
    description:
      "Environmental Policy and Global Initiatives. Explore international agreements and advanced environmental challenges.",
    level: Level.ADVANCED,
    progress: 0,
    completed: false,
    tags: defaultTags,
  },
];

// Get lessons
export const getLessons = async (): Promise<Lesson[]> => {
  // Utilize promise to simulate API call
  return new Promise((resolve) => setTimeout(() => resolve(lessons), 300));
};

// Get lesson by id
export const getLessonById = async (
  id: number
): Promise<Lesson | undefined> => {
  // Utilize promise to simulate API call
  return new Promise((resolve) =>
    setTimeout(() => resolve(lessons.find((lesson) => lesson.id === id)), 300)
  );
};
