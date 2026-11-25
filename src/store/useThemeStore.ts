import { create } from "zustand";

export type Theme = string;

interface ThemeState {
  theme: Theme;
  availableThemes: Theme[];
  setTheme: (theme: Theme) => void;
}

const DEFAULT_THEMES = [
  "light",
  "dark",
  "corporate",
  "lofi",
  "garden",
  "forest",
  "cmyk",
  "dim",
  "silk",
];

const STORAGE_KEY = "theme";
const DEFAULT_THEME = "system";

// Helper untuk mengambil tema awal dari localStorage
const getInitialTheme = (): Theme => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && DEFAULT_THEMES.includes(saved)) return saved;
    return DEFAULT_THEME;
  } catch (error) {
    console.warn("Gagal membaca tema dari localStorage:", error);
    return DEFAULT_THEME;
  }
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  availableThemes: DEFAULT_THEMES,
  setTheme: (theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      console.warn("Gagal menyimpan tema ke localStorage:", error);
    }
    set({ theme });
  },
}));

// Fungsi inisialisasi DOM (dapat dipanggil sekali di main.tsx atau App.tsx)
export function initThemeListener() {
  const applyTheme = (currentTheme: Theme) => {
    const root = document.documentElement;

    if (currentTheme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", isDark);
      root.setAttribute("data-theme", isDark ? "dark" : "light");
    } else {
      root.classList.toggle("dark", currentTheme === "dark");
      root.setAttribute("data-theme", currentTheme);
    }
  };

  // Jalankan pertama kali saat load
  applyTheme(useThemeStore.getState().theme);

  // Subscribe ke perubahan state Zustand secara otomatis
  useThemeStore.subscribe((state) => {
    applyTheme(state.theme);
  });

  // Listener untuk perubahan preferensi sistem (jika mode "system")
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", (e) => {
    if (useThemeStore.getState().theme === "system") {
      const root = document.documentElement;
      root.classList.toggle("dark", e.matches);
      root.setAttribute("data-theme", e.matches ? "dark" : "light");
    }
  });
}
