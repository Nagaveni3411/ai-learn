import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  tree: null,
  loading: false,
  error: null,
  setTree: (tree) => set({ tree }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  markVideoCompleted: (videoId) =>
    set((state) => {
      if (!state.tree) return state;
      return {
        tree: {
          ...state.tree,
          sections: state.tree.sections.map((section) => ({
            ...section,
            videos: section.videos.map((video) =>
              String(video.id) === String(videoId) ? { ...video, is_completed: true } : video
            )
          }))
        }
      };
    })
}));
