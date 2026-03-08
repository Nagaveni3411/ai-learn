import axios from "axios";
import { API_BASE_URL } from "./config";
import { useAuthStore } from "../store/authStore";

const apiClient = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : "/api",
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue = [];

function flushQueue(error, token = null) {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  queue = [];
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) throw error;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(original));
          },
          reject
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      if (!API_BASE_URL) {
        throw new Error("Missing VITE_API_BASE_URL in deployment environment.");
      }
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });
      useAuthStore.getState().setAccessToken(data.access_token);
      flushQueue(null, data.access_token);
      original.headers.Authorization = `Bearer ${data.access_token}`;
      return apiClient(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      useAuthStore.getState().logout();
      window.location.href = "/login";
      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
