export type Topic = {
  id: number;
  slug: string;
  title: string;
  description: string;
  history?: string;
  icon: React.ReactNode;
  config?: {
    color: string;
  };
};
