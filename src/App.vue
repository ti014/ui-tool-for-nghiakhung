<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { useTheme } from './composables/useTheme'

const { isDark } = useTheme()
</script>

<style>
:root {
  /* Light theme colors */
  --primary-color: #42b983;
  --primary-hover: #3aa876;
  --primary-light: rgba(66, 185, 131, 0.1);
  --text-primary: #2c3e50;
  --text-secondary: #666666;
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --border-color: #e0e0e0;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --nav-height: 72px;
  --footer-height: 60px;
  --bg-primary-rgb: 255, 255, 255;

  /* Transitions */
  --transition-speed: 0.3s;
}

/* Dark theme colors */
.dark {
  --primary-color: #42b983;
  --primary-hover: #4dd196;
  --primary-light: rgba(66, 185, 131, 0.2);
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --border-color: #404040;
  --shadow-color: rgba(0, 0, 0, 0.3);
  --bg-primary-rgb: 26, 26, 26;
}

/* Global styles */
body {
  margin: 0;
  transition: background-color var(--transition-speed) ease;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-primary);
  min-height: 100vh;
  background-color: var(--bg-secondary);
  transition: background-color var(--transition-speed) ease,
              color var(--transition-speed) ease;
  display: flex;
  flex-direction: column;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-speed) ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>