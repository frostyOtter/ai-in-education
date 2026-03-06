import { create } from "zustand";

type SectionStore = {
  activeSection: string;
  setActiveSection: (section: string) => void;
  endSection: boolean;
  setEndSection: (endSection: boolean) => void;
};

export const useSectionStore = create<SectionStore>((set) => ({
  activeSection: "Conversation Structures",
  setActiveSection: (section: string) => set({ activeSection: section }),
  endSection: false,
  setEndSection: (endSection: boolean) => set({ endSection }),
}));
