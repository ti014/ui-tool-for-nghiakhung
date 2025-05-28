<template>
  <div class="main-layout">
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <router-link to="/" class="logo">
            <img src="@/assets/icons/fis-logo.svg" alt="Logo" class="nav-logo" />
            <h1>UI Tool For Kiosk</h1>
          </router-link>
        </div>
        <div class="header-right">
          <nav class="nav-menu">
            <router-link to="/" class="nav-item">
              <span class="nav-icon">
                <img src="@/assets/icons/home-icon.png" alt="Home" style="width: 20px; height: 20px; display: block;" />
              </span>
              <span class="nav-text">Trang chủ</span>
            </router-link>
            <router-link to="/settings" class="nav-item" @click.prevent="handleSettingsClick">
              <span class="nav-icon">
                <img src="@/assets/icons/settings-icon.png" alt="Settings" style="width: 20px; height: 20px; display: block;" />
              </span>
              <span class="nav-text">Cài đặt</span>
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <main class="main-content">
      <slot></slot>
    </main>

    <footer class="main-footer">
      <div class="footer-content">
        <div class="footer-info">
          <img src="@/assets/icons/fis-logo.svg" alt="Logo" class="footer-logo" />
          <div class="footer-text">
            <h3>UI Tool For Kiosk</h3>
            <p>Tool dùng để kiểm tra nhanh tính năng Kiosk, được phát triển bởi đội ngũ phát triển FIS DS RPD</p>
          </div>
        </div>
        <div class="footer-copyright">
          <p>&copy; {{ new Date().getFullYear() }} UI Tool For Kiosk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

export default {
  name: 'MainLayout',
  setup() {
    const router = useRouter()
    const { isDark, toggleTheme } = useTheme()

    const handleSettingsClick = (event) => {
      router.push('/settings')
    }

    return {
      handleSettingsClick,
      isDark,
      toggleTheme
    }
  }
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: var(--bg-primary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background-color: rgba(var(--bg-primary-rgb), 0.95);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.logo:hover {
  background: var(--primary-light);
}

.nav-logo {
  height: 44px;
  width: 44px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.logo:hover .nav-logo {
  transform: scale(1.05);
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--primary-color);
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
}

.nav-item {
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.nav-item:hover {
  color: var(--primary-color);
  background: var(--bg-secondary);
}

.nav-item.router-link-active {
  color: var(--primary-color);
  background: var(--bg-secondary);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: none;
  border: none;
  color: var(--text-primary);
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.theme-toggle.nav-item:hover {
  color: var(--primary-color);
  background: var(--bg-secondary);
}

.theme-toggle .nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.sun-icon {
  background-image: url('@/assets/icons/light-mode-icon.png');
}

.moon-icon {
  background-image: url('@/assets/icons/dark-mode-icon.png');
}

.main-content {
  flex: 1;
  margin-top: 64px; /* Header height */
  padding: 2rem;
  background-color: var(--bg-secondary);
}

.main-footer {
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  padding: 0;
  height: var(--footer-height);
}

.footer-content {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 2rem;
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
  width: 36px;
  height: 36px;
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

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .nav-menu {
    gap: 0.5rem;
  }

  .nav-text {
    display: none;
  }

  .nav-item {
    padding: 0.5rem;
  }

  .footer-content {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    text-align: center;
  }

  .footer-info {
    justify-content: center;
  }
}
</style> 