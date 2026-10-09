export const getEnv = (key: string, defaultValue = ""): string => {
  // 1. Runtime config
  if (typeof window !== "undefined") {
    const runtimeValue = window.configs?.[key];

    if (runtimeValue !== undefined && runtimeValue !== "") {
      return runtimeValue;
    }
  }

  // 2. Build-time config dari Vite
  const viteKey = key.startsWith("VITE_") ? key : `VITE_${key}`;

  const viteValue = import.meta.env[viteKey as keyof ImportMetaEnv];

  if (viteValue !== undefined && viteValue !== "") {
    return String(viteValue);
  }

  // 3. Default value
  return defaultValue;
};
