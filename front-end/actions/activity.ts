import { Level } from "@/enum/course";
import { Lesson } from "@/types/lesson";

const lessons: Lesson[] = [
  {
    id: 1,
    title: "Lesson 1",
    description: "Learn about nature, climate, and environmental",
    level: Level.BEGINNER,
    progress: 100,
    completed: true,
    tags: [
      "Sustainability",
      "Renewable energy",
      "Carbon footprint",
      "Biodiversity",
      "Conservation",
      "Eco-friendly",
    ],
  },
  {
    id: 2,
    title: "Lesson 2",
    description: "Learn about nature, climate, and environmental",
    level: Level.BEGINNER,
    progress: 75,
    completed: false,
    tags: [
      "Sustainability",
      "Renewable energy",
      "Carbon footprint",
      "Biodiversity",
      "Conservation",
      "Eco-friendly",
    ],
  },
  {
    id: 3,
    title: "Lesson 3",
    description: "Learn about nature, climate, and environmental",
    level: Level.INTERMEDIATE,
    progress: 0,
    completed: false,
    tags: [
      "Sustainability",
      "Renewable energy",
      "Carbon footprint",
      "Biodiversity",
      "Conservation",
      "Eco-friendly",
    ],
  },
  {
    id: 4,
    title: "Lesson 4",
    description: "Learn about nature, climate, and environmental",
    level: Level.UPPER_INTERMEDIATE,
    progress: 0,
    completed: false,
    tags: [
      "Sustainability",
      "Renewable energy",
      "Carbon footprint",
      "Biodiversity",
      "Conservation",
      "Eco-friendly",
    ],
  },
  {
    id: 5,
    title: "Lesson 5",
    description: "Learn about nature, climate, and environmental",
    level: Level.ADVANCED,
    progress: 0,
    completed: false,
    tags: [
      "Sustainability",
      "Renewable energy",
      "Carbon footprint",
      "Biodiversity",
      "Conservation",
      "Eco-friendly",
    ],
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
