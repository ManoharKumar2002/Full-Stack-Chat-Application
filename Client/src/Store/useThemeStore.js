import { create } from "zustand";

export const useThemeStore = create((set) => ({
    // Initial theme from localStorage or default to "dark"
    theme : localStorage.getItem("chat-theme") || "light" ,

    // Function to update the theme
    setTheme:(theme) =>{
        localStorage.setItem("chat-theme", theme);  // Save theme to localStorage
        set({theme });  // Update Zustand store
    }
}))


