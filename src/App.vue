<template>
  <div id="app" :class="{ 'dark': isDark }">
    <nav v-if="$route.path !== '/login'" class="main-nav">
      <div class="nav-content">
        <router-link to="/" class="logo-link">
          <img src="@/assets/icons/apps-icon.png" alt="Logo" class="nav-logo" />
        </router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">
            <div class="nav-icon home-icon"></div>
          </router-link>
          <button @click="toggleTheme" class="theme-toggle" :title="isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'">
            <span class="sr-only">{{ isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối' }}</span>
            <div class="theme-icon" :class="isDark ? 'sun-icon' : 'moon-icon'"></div>
          </button>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="main-footer">
      <div class="footer-content">
        <div class="footer-info">
          <img src="@/assets/icons/apps-icon.png" alt="Logo" class="footer-logo" />
          <div class="footer-text">
            <h3>UI Tool</h3>
            <p>Công cụ hỗ trợ giao diện người dùng</p>
          </div>
        </div>
        <div class="footer-copyright">
          <p>&copy; {{ new Date().getFullYear() }} UI Tool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useTheme } from './composables/useTheme'

const { isDark, toggleTheme } = useTheme()
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

/* Navigation */
.main-nav {
  background: var(--bg-primary);
  height: var(--nav-height);
  box-shadow: 0 3px 10px var(--shadow-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background-color var(--transition-speed) ease,
              box-shadow var(--transition-speed) ease;
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background-color: rgba(var(--bg-primary-rgb), 0.95);
}

.nav-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary);
  transition: all var(--transition-speed) ease;
  padding: 12px;
  border-radius: 12px;
}

.logo-link:hover {
  background: var(--primary-light);
  color: var(--primary-color);
}

.nav-logo {
  height: 38px;
  width: 38px;
  margin-right: 16px;
  object-fit: contain;
  transition: transform var(--transition-speed) ease;
}

.logo-link:hover .nav-logo {
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
  height: 100%;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  padding: 0 24px;
  border-radius: 10px;
  transition: all var(--transition-speed) ease;
  height: 44px;
  font-size: 1.05rem;
  background: transparent;
}

.nav-link span {
  margin-left: 12px;
  line-height: 1;
}

.nav-link:hover {
  background: var(--primary-light);
  color: var(--primary-color);
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  color: var(--primary-color);
  background: var(--primary-light);
  font-weight: 600;
}

.nav-icon {
  width: 22px;
  height: 22px;
  margin-right: 0;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  flex-shrink: 0;
  transition: transform var(--transition-speed) ease;
}

.nav-link:hover .nav-icon {
  transform: scale(1.1);
}

.home-icon {
  background-image: url('@/assets/icons/home-icon.png');
}

.sun-icon {
  background-image: url('@/assets/icons/light-mode-icon.png');
}

.moon-icon {
  background-image: url('@/assets/icons/dark-mode-icon.png');
}

/* Theme toggle button */
.theme-toggle {
  background: transparent;
  border: none;
  color: var(--text-primary);
  width: 44px;
  height: 44px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-speed) ease;
  padding: 0;
  margin-left: 8px;
}

.theme-toggle:hover {
  background: var(--primary-light);
  color: var(--primary-color);
  transform: translateY(-1px);
}

.theme-icon {
  width: 22px;
  height: 22px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  flex-shrink: 0;
  transition: transform var(--transition-speed) ease;
}

.theme-toggle:hover .theme-icon {
  transform: scale(1.1);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* Main content */
.main-content {
  padding: calc(var(--nav-height) + 32px) 48px calc(var(--footer-height) + 32px);
  min-height: calc(100vh - var(--nav-height) - var(--footer-height));
  flex: 1;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  transition: padding var(--transition-speed) ease;
}

.main-footer {
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  padding: 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--footer-height);
  z-index: 900;
}

.footer-content {
  max-width: 1440px;
  height: 100%;
  margin: 0 auto;
  padding: 0 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.footer-text {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.footer-text h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.footer-copyright {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.footer-copyright p {
  margin: 0;
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

/* Responsive design */
@media (max-width: 1440px) {
  .nav-content,
  .footer-content {
    max-width: 1200px;
    padding: 0 32px;
  }
}

@media (max-width: 768px) {
  :root {
    --nav-height: 64px;
    --footer-height: 48px;
  }

  .nav-content,
  .footer-content {
    padding: 0 16px;
  }

  .logo-link {
    padding: 8px;
  }

  .nav-logo {
    height: 32px;
    width: 32px;
    margin-right: 12px;
  }

  .app-name {
    display: none;
  }

  .nav-links {
    gap: 12px;
  }

  .nav-link {
    padding: 0;
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .nav-link span {
    display: none;
  }

  .nav-icon {
    margin: 0;
    width: 22px;
    height: 22px;
  }

  .theme-toggle {
    width: 40px;
    height: 40px;
    margin-left: 4px;
  }

  .theme-icon {
    width: 22px;
    height: 22px;
  }

  .main-content {
    padding: calc(var(--nav-height) + 16px) 16px calc(var(--footer-height) + 16px);
  }

  .footer-logo {
    width: 20px;
    height: 20px;
  }

  .footer-text {
    font-size: 0.8rem;
  }

  .footer-text h3 {
    font-size: 0.8rem;
  }

  .footer-copyright {
    font-size: 0.75rem;
  }
}

/* Dark theme - remove icon filter */
.dark .nav-icon,
.dark .theme-icon,
.dark .feature-icon {
  filter: none;
}
</style>