import { ref, watch } from "vue";

const THEME_KEY = "ui-tool-theme";
const DARK = "dark";
const LIGHT = "light";

export const useTheme = () => {
  const theme = ref(
    localStorage.getItem(THEME_KEY) ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK : LIGHT)
  );

  const isDark = ref(theme.value === DARK);

  const toggleTheme = () => {
    theme.value = theme.value === DARK ? LIGHT : DARK;
    isDark.value = theme.value === DARK;
  };

  watch(
    theme,
    (newTheme) => {
      localStorage.setItem(THEME_KEY, newTheme);
      if (newTheme === DARK) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    { immediate: true }
  );

  return {
    theme,
    isDark,
    toggleTheme,
  };
};

export default useTheme;
