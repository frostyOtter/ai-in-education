import { Topic } from "@/types/topic";

const topics: Topic[] = [
  {
    id: 1,
    slug: "/conversation/speaking-practice",
    title: "Speaking Practice",
    description:
      "Practice simple conversations about nature and weather with an AI tutor.",
    history: "7/10 last session",
    icon: "Mic",
    config: {
      color: "bg-orange-500",
    },
  },
  {
    id: 2,
    slug: "/conversation/reading-comprehension",
    title: "Reading Comprehension",
    description:
      "Read short texts about the environment, weather, and climate.",
    history: "6/10 last session",
    icon: "BookOpen",
    config: {
      color: "bg-blue-500",
    },
  },
  {
    id: 3,
    slug: "/conversation/listening-exercise",
    title: "Listening Exercise",
    description:
      "Listen to short audio clips (e.g., weather reports, nature facts).",
    history: "8/10 last session",
    icon: "Headset",
    config: {
      color: "bg-green-500",
    },
  },
  {
    id: 4,
    slug: "/conversation/writing-assignment",
    title: "Writing Assignment",
    description: "Write 2–3 sentence responses using key vocabulary.",
    history: "8/10 last session",
    icon: "Pen",
    config: {
      color: "bg-pink-500",
    },
  },
];

export const getTopics = async (): Promise<Topic[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(topics), 300));
};

export const getTopicById = async (id: number): Promise<Topic | undefined> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(topics.find((topic) => topic.id === id)), 300)
  );
};
