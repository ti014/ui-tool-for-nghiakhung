<template>
  <MainLayout>
    <div class="settings-container">
      <div class="settings-header">
        <h2 class="settings-title">Cài đặt</h2>
        <p class="settings-subtitle">Tùy chỉnh ứng dụng theo ý của bạn</p>
      </div>
      
      <!-- Cài đặt chung -->
      <div class="settings-section">
        <div class="section-header">
          <h3>Cài đặt chung</h3>
        </div>
        <div class="settings-options">
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" v-model="settings.autoSave">
              <span class="setting-text">Tự động lưu</span>
              <span class="setting-description">Tự động lưu các thay đổi của bạn</span>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" v-model="settings.notifications">
              <span class="setting-text">Thông báo</span>
              <span class="setting-description">Nhận thông báo về các cập nhật và thay đổi</span>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" v-model="settings.animations">
              <span class="setting-text">Hiệu ứng</span>
              <span class="setting-description">Bật/tắt các hiệu ứng chuyển động</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Cài đặt giao diện -->
      <div class="settings-section">
        <div class="section-header">
          <h3>Giao diện</h3>
        </div>
        <div class="settings-options">
          <div class="setting-item">
            <span class="setting-text">Ngôn ngữ</span>
            <select v-model="settings.language" class="setting-select">
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
          <div class="setting-item">
            <span class="setting-text">Kích thước font chữ</span>
            <div class="font-size-control">
              <button @click="decreaseFontSize" class="control-button">A-</button>
              <span class="font-size-value">{{ settings.fontSize }}px</span>
              <button @click="increaseFontSize" class="control-button">A+</button>
            </div>
          </div>
          <div class="setting-item">
            <span class="setting-text">Mật độ hiển thị</span>
            <div class="density-control">
              <button 
                v-for="density in ['Comfortable', 'Cozy', 'Compact']" 
                :key="density"
                :class="['density-button', { active: settings.density === density }]"
                @click="settings.density = density"
              >
                {{ density }}
              </button>
            </div>
          </div>
          <div class="setting-item">
            <span class="setting-text">Chế độ giao diện</span>
            <button @click="toggleTheme" class="theme-toggle-setting" :aria-label="isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'">
              <span class="theme-icon" :class="isDark ? 'sun-icon' : 'moon-icon'"></span>
              <span class="theme-label">{{ isDark ? 'Sáng' : 'Tối' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Cài đặt bảo mật -->
      <div class="settings-section">
        <div class="section-header">
          <h3>Bảo mật</h3>
        </div>
        <div class="settings-options">
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" v-model="settings.autoLock">
              <span class="setting-text">Tự động khóa</span>
              <span class="setting-description">Tự động khóa sau 5 phút không hoạt động</span>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" v-model="settings.biometric">
              <span class="setting-text">Xác thực sinh trắc học</span>
              <span class="setting-description">Sử dụng vân tay hoặc Face ID để đăng nhập</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Nút chế độ nhà phát triển -->
      <div class="settings-section developer-section">
        <button class="developer-button" @click="handleDeveloperClick">
          Chế độ nhà phát triển
        </button>
      </div>

      <!-- Chế độ nhà phát triển (ẩn) -->
      <div v-if="settings.developerMode" class="settings-section develop-section">
        <div class="section-header">
          <h3>Chế độ nhà phát triển</h3>
        </div>
        <div class="settings-options">
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" :checked="settings.developerMode" @change="toggleDeveloperMode()">
              <span class="setting-text">Bật chế độ nhà phát triển</span>
              <span class="setting-description">Kích hoạt các tính năng dành cho nhà phát triển</span>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" v-model="settings.debugMode">
              <span class="setting-text">Debug Mode</span>
              <span class="setting-description">Hiển thị thông tin debug và console</span>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" v-model="settings.logging">
              <span class="setting-text">Logging</span>
              <span class="setting-description">Ghi lại các hoạt động của ứng dụng</span>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" v-model="settings.testMode">
              <span class="setting-text">Test Mode</span>
              <span class="setting-description">Kích hoạt các tính năng thử nghiệm</span>
            </label>
          </div>
          <div class="setting-item">
            <span class="setting-text">API Endpoint</span>
            <input 
              type="text" 
              v-model="settings.apiEndpoint" 
              class="setting-input"
              placeholder="https://api.example.com"
            >
          </div>
        </div>
      </div>
  </div>
  </MainLayout>
</template>

<script>
import { ref, reactive } from 'vue'
import MainLayout from '@/components/layouts/MainLayout.vue'
import { useTheme } from '@/composables/useTheme'

export default {
  name: 'SettingsView',
  components: {
    MainLayout
  },
  setup() {
    const settings = reactive({
      // Cài đặt chung
      autoSave: true,
      notifications: true,
      animations: true,
      
      // Giao diện
      language: 'vi',
      fontSize: 16,
      density: 'Comfortable',
      
      // Bảo mật
      autoLock: false,
      biometric: false,
      
      // Chế độ nhà phát triển
      debugMode: false,
      logging: false,
      testMode: false,
      apiEndpoint: '',
      developerMode: localStorage.getItem('developerMode') === 'true'
    })

    let clickCount = 0
    let lastClickTime = 0

    const handleDeveloperClick = () => {
      const currentTime = Date.now()
      
      if (currentTime - lastClickTime > 3000) {
        clickCount = 0
      }
      
      clickCount++
      lastClickTime = currentTime

      if (clickCount >= 10) {
        toggleDeveloperMode(true)
        clickCount = 0
      }
    }

    const toggleDeveloperMode = (forceValue = null) => {
      const newValue = forceValue !== null ? forceValue : !settings.developerMode
      
      settings.developerMode = newValue
      localStorage.setItem('developerMode', newValue.toString())
      
      if (!newValue) {
        settings.debugMode = false
        settings.logging = false
        settings.testMode = false
        settings.apiEndpoint = ''
        clickCount = 0
      }
    }

    const increaseFontSize = () => {
      if (settings.fontSize < 24) {
        settings.fontSize++
      }
    }

    const decreaseFontSize = () => {
      if (settings.fontSize > 12) {
        settings.fontSize--
      }
    }

    // Thêm theme
    const { isDark, toggleTheme } = useTheme()

    return {
      settings,
      handleDeveloperClick,
      toggleDeveloperMode,
      increaseFontSize,
      decreaseFontSize,
      isDark,
      toggleTheme
    }
  }
}
</script>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-header {
  text-align: center;
  margin-bottom: 3rem;
}

.settings-title {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.settings-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.settings-section {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.settings-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  color: var(--text-primary);
  font-size: 1.3rem;
  margin: 0;
}

.settings-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.setting-label {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  cursor: pointer;
  flex: 1;
}

.setting-text {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.setting-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  display: block;
}

.setting-select,
.setting-input {
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  min-width: 200px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.setting-select:hover,
.setting-input:hover {
  border-color: var(--primary-color);
}

.setting-select:focus,
.setting-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-light);
}

/* Font size control */
.font-size-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-button {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.control-button:hover {
  background: var(--primary-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.font-size-value {
  min-width: 60px;
  text-align: center;
  color: var(--text-primary);
}

/* Density control */
.density-control {
  display: flex;
  gap: 0.5rem;
}

.density-button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

.density-button:hover {
  background: var(--primary-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.density-button.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

/* Developer section styles */
.developer-section {
  text-align: center;
}

.developer-button {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
}

.developer-button:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

/* Develop mode specific styles */
.develop-section {
  border: 2px solid var(--primary-color);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(66, 185, 131, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(66, 185, 131, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(66, 185, 131, 0);
  }
}

/* Checkbox styling */
input[type="checkbox"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--primary-color);
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

input[type="checkbox"]:checked {
  background-color: var(--primary-color);
}

input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 14px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Responsive design */
@media (max-width: 768px) {
  .settings-container {
    padding: 1rem;
  }

  .settings-title {
    font-size: 2rem;
  }

  .settings-subtitle {
    font-size: 1rem;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .setting-select,
  .setting-input {
    width: 100%;
  }

  .font-size-control,
  .density-control {
    width: 100%;
    justify-content: space-between;
  }

  .density-button {
    flex: 1;
  }
}

/* Theme toggle styling */
.theme-toggle-setting {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.theme-toggle-setting:hover {
  background: var(--primary-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
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
.theme-label {
  min-width: 32px;
  text-align: left;
}
</style>
