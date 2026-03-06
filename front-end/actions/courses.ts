import { Course } from "@/types/course";
import { lessons } from "./lesson";

const courses: Course[] = [
  {
    slug: "/lessons/environment",
    title: "Environment",
    description: "Learn about nature, climate, and environmental",
    icon: "Environment",
    lessons: lessons,
  },
  {
    slug: "/lessons/traffic",
    title: "Traffic",
    description: "Transportation, driving, and city navigation",
    icon: "Traffic",
    lessons: lessons,
  },
  {
    slug: "/lessons/technology",
    title: "Technology",
    description: "Digital world, gadgets, and innovation",
    icon: "Technology",
    lessons: lessons,
  },
  {
    slug: "/lessons/health",
    title: "Health",
    description: "Wellness, medical topics, and healthy living",
    icon: "Health",
    lessons: lessons,
  },
  {
    slug: "/lessons/work",
    title: "Work",
    description: "Career, office life, and professional skills",
    icon: "Work",
    lessons: lessons,
  },
  {
    slug: "/lessons/travel",
    title: "Travel",
    description: "Adventures, cultures, and exploring the world",
    icon: "Travel",
    lessons: lessons,
  },
  {
    slug: "/lessons/home-family",
    title: "Home & Family",
    description: "Family life, relationships, and domestic topics",
    icon: "Home",
    lessons: lessons,
  },
  {
    slug: "/lessons/food-dining",
    title: "Food & Dining",
    description: "Cooking, restaurants, and culinary experiences",
    icon: "Food",
    lessons: lessons,
  },
  {
    slug: "/lessons/education",
    title: "Education",
    description: "Learning, schools, and academic topics",
    icon: "Education",
    lessons: lessons,
  },
];

export const getCourses = async (): Promise<Course[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(courses), 300));
};

export const getCourseBySlug = async (
  slug: string
): Promise<Course | undefined> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      const course = courses.find(
        (course) => course.slug.split("/")[2] === slug
      );
      console.log(course);
      resolve(course);
    }, 300)
  );
};
