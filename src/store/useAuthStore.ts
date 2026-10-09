// C:\Project\Production\insite-react\src\store\useAuthStore.ts
import { create } from "zustand";
import { decrypt, encrypt } from "@/utils/secureStorage";

export interface UserData {
  id: string;
  email?: string;
  username?: string; // <-- Ditambahkan agar mendukung IPTV / login berbasis username
  token: string;
  role: string;
  permissions: any[];
}

interface AuthState {
  token: string | null;
  user: UserData | null;
  loading: boolean;
  setToken: (token: string | null) => void;
  login: (token: string, userData: UserData) => void;
  logout: () => void;
}

// Helper untuk membaca localStorage dengan aman di awal
const getInitialAuth = () => {
  try {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = decrypt<UserData>(stored);
      if (parsed) {
        return { user: parsed, token: parsed.token };
      }
    }
  } catch {
    localStorage.removeItem("user");
  }
  return { user: null, token: null };
};

const initial = getInitialAuth();

export const useAuthStore = create<AuthState>((set) => ({
  token: initial.token,
  user: initial.user,
  loading: false,

  setToken: (token) => set({ token }),

  login: (newToken, userData) => {
    const newUser: UserData = {
      ...userData,
      token: newToken,
    };
    localStorage.setItem("user", encrypt(newUser));
    set({ token: newToken, user: newUser });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userQueue");
    set({ token: null, user: null });
  },
}));
