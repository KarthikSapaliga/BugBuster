import { create } from "zustand";
import { createAuthSlice } from "./AuthSlice.js";
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
