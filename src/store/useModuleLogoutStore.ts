import { create } from "zustand";

interface ModuleLogoutState {
  handlers: Record<string, () => Promise<void>>;
  register: (moduleName: string, fn: () => Promise<void>) => void;
  unregister: (moduleName: string) => void;
  getHandler: (moduleName: string) => (() => Promise<void>) | undefined;
}

export const useModuleLogoutStore = create<ModuleLogoutState>((set, get) => ({
  handlers: {},
  register: (moduleName, fn) =>
    set((state) => ({
      handlers: { ...state.handlers, [moduleName]: fn },
    })),
  unregister: (moduleName) =>
    set((state) => {
      const newHandlers = { ...state.handlers };
      delete newHandlers[moduleName];
      return { handlers: newHandlers };
    }),
  getHandler: (moduleName) => get().handlers[moduleName],
}));
