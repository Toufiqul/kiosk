import { create } from "zustand";

export interface AuthState {
  isAuthenticated: boolean;
  authenticateWith: (token: string) => void;
  deAuthenticate: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: !!window.localStorage.getItem("auth_token"),

  authenticateWith: (token: string) => {
    window.localStorage.setItem("auth_token", token);

    set({
      isAuthenticated: true,
    });
  },
  deAuthenticate: () => {
    window.localStorage.removeItem("auth_token");

    set({
      isAuthenticated: false,
    });
  },
}));
