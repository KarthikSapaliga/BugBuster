import { create } from "zustand";
import { createAuthSlice } from "./authSlice";
import { persist } from "zustand/middleware";

export const useAppStore = create(
    persist(
        (set, get) => ({
            ...createAuthSlice(set, get),
        }),
        {
            name: "auth-storage",
        }
    )
);
