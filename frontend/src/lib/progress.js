import apiClient from "./apiClient";

const timers = new Map();

export function sendProgressDebounced(videoId, payload, wait = 5000) {
  const key = String(videoId);
  if (timers.has(key)) clearTimeout(timers.get(key));
  const timer = setTimeout(async () => {
    try {
      await apiClient.post(`/progress/videos/${videoId}`, payload);
    } catch (_) {
      // Ignore transient errors so playback can continue
    } finally {
      timers.delete(key);
    }
  }, wait);
  timers.set(key, timer);
}

export function cancelPendingProgress(videoId) {
  const key = String(videoId);
  if (timers.has(key)) {
    clearTimeout(timers.get(key));
    timers.delete(key);
  }
}

export async function flushProgress(videoId, payload) {
  await apiClient.post(`/progress/videos/${videoId}`, payload);
}

export async function flushProgressWithRetry(videoId, payload, retries = 2) {
  let lastError;
  for (let i = 0; i <= retries; i += 1) {
    try {
      await apiClient.post(`/progress/videos/${videoId}`, payload);
      return;
    } catch (err) {
      lastError = err;
      await new Promise((resolve) => setTimeout(resolve, 250 * (i + 1)));
    }
  }
  throw lastError;
}
