import { create } from "zustand";

export const useVideoStore = create((set) => ({
  currentVideoId: null,
  subjectId: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  isCompleted: false,
  nextVideoId: null,
  prevVideoId: null,
  setVideoState: (payload) => set((state) => ({ ...state, ...payload }))
}));
