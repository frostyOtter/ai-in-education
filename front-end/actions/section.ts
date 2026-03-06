"use server";

const sections = ["Introduction", "Main Activities", "Conclusion"];

const getSection = (): Promise<string[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(sections), 300));
};

export default getSection;
