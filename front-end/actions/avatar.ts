type Avatar = {
  id: number;
  name: string;
  description: string;
  character: string;
  src: string;
};

const avatars: Avatar[] = [
  {
    id: 1,
    name: "Luna",
    description:
      "A warm and patient teacher who loves helping students build confidence",
    character: "😄 Friendly and encouraging",
    src: "/luna.mp4",
  },
  {
    id: 2,
    name: "Jay",
    description:
      "A structured instructor who provides clear guidance and detailed feedback",
    character: "😊 ️ Professional and focused",
    src: "/jay.mp4",
  },
  {
    id: 3,
    name: "Emma",
    description:
      "An enthusiastic mentor who makes learning exciting and interactive",
    character: "🔥 Energetic and fun",
    src: "/emma.mp4",
  },
];

export const getAvatars = (): Promise<Avatar[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(avatars), 300));
};

export const getAvatarById = async (
  id: number
): Promise<Avatar | undefined> => {
  return avatars.find((avatar) => avatar.id === id);
};
