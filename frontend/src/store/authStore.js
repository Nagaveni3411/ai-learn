import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  login: ({ user, accessToken }) =>
    set({ user, accessToken, isAuthenticated: true }),
  setAccessToken: (accessToken) => set((s) => ({ ...s, accessToken })),
  logout: () => set({ user: null, accessToken: null, isAuthenticated: false })
}));
