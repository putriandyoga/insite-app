/**
 * Helper to get environment variables.
 * It prioritizes runtime config (window.configs) injected by Docker,
 * and falls back to build-time config (import.meta.env).
 */
export const getEnv = (key: string, defaultValue: string = ""): string => {
  // Try runtime config first
  if (window.configs && window.configs[key]) {
    return window.configs[key];
  }

  // Try import.meta.env next
  const viteKey = key.startsWith("VITE_") ? key : `VITE_${key}`;
  const viteValue = ((import.meta as any).env as Record<string, any>)[viteKey];

  if (viteValue !== undefined) {
    return String(viteValue);
  }

  return defaultValue;
};
