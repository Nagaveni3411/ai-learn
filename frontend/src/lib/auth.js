import apiClient from "./apiClient";
import { useAuthStore } from "../store/authStore";

export async function loginRequest(payload) {
  const { data } = await apiClient.post("/auth/login", payload);
  useAuthStore.getState().login({ user: data.user, accessToken: data.access_token });
  return data;
}

export async function registerRequest(payload) {
  const { data } = await apiClient.post("/auth/register", payload);
  useAuthStore.getState().login({ user: data.user, accessToken: data.access_token });
  return data;
}

export async function logoutRequest() {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    useAuthStore.getState().logout();
  }
}
