import { useEffect, useState } from "react";

const DARK_MODE_SETTING_KEY = "darkMode";

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(DARK_MODE_SETTING_KEY);
    if (saved !== null) return saved === "true";

    // Fallback to system's active color scheme
    return matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem(DARK_MODE_SETTING_KEY, isDark.toString());
  }, [isDark]);

  const toggle = () => setIsDark(!isDark);

  return { isDark, toggle };
};

export default useDarkMode;
