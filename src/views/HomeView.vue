<template>
  <div class="home-view">
    <div class="features-grid">
      <div
        v-for="feature in features"
        :key="feature.id"
        class="feature-card"
        @click="navigateToFeature(feature.routeName)"
        @keypress.enter="navigateToFeature(feature.routeName)"
        tabindex="0"
        role="button"
        :aria-label="`Mở ${feature.name}`"
      >
        <div class="card-icon-wrapper">
          <div :class="['feature-icon', feature.iconClass]"></div>
        </div>
        <h3 class="card-title">{{ feature.name }}</h3>
        <p class="card-description">{{ feature.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const features = ref([
  {
    id: 'all',
    name: 'Tất cả',
    description: 'Kiểm tra tất cả các tính năng: nfc, ocr, camera và máy in',
    iconClass: 'apps',
    routeName: 'AllFeaturesView'
  },
  {
    id: 'camera',
    name: 'Camera',
    description: 'Kiểm tra tính năng camera của thiết bị',
    iconClass: 'camera',
    routeName: 'CameraView'
  },
  {
    id: 'nfc',
    name: 'NFC',
    description: 'Kiểm tra tính năng NFC của thiết bị',
    iconClass: 'nfc',
    routeName: 'NfcView'
  },
  {
    id: 'printer',
    name: 'Printer',
    description: 'Kiểm tra tính năng máy in của thiết bị',
    iconClass: 'printer',
    routeName: 'PrinterView'
  },
  {
    id: 'ocr',
    name: 'OCR',
    description: 'Kiểm tra tính năng OCR của thiết bị',
    iconClass: 'ocr',
    routeName: 'OcrView'
  },
  {
    id: 'settings',
    name: 'Cài đặt',
    description: 'Cài đặt cấu hình của ứng dụng',
    iconClass: 'settings',
    routeName: 'SettingsView'
  }
])

const navigateToFeature = (routeName) => {
  if (routeName) {
    router.push({ name: routeName })
  }
}
</script>

<style scoped>
.home-view {
  padding: 40px 20px;
  background-color: var(--bg-secondary);
  min-height: 100vh;
  box-sizing: border-box;
  transition: background-color var(--transition-speed) ease;
}

.main-title {
  text-align: center;
  font-size: 2.5em;
  color: var(--text-primary);
  margin-bottom: 60px;
  font-weight: 600;
  transition: color var(--transition-speed) ease;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 35px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.feature-card {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 30px 25px;
  text-align: center;
  box-shadow: 0 8px 16px var(--shadow-color);
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 220px;
}

.feature-card:hover,
.feature-card:focus {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 24px var(--shadow-color);
  border-color: var(--primary-color);
  outline: none;
}

.card-icon-wrapper {
  margin-bottom: 20px;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-secondary);
  border-radius: 50%;
  transition: all var(--transition-speed) ease;
}

.feature-card:hover .card-icon-wrapper {
  background-color: var(--primary-light);
  transform: scale(1.1) rotate(5deg);
}

.card-title {
  font-size: 1.4em;
  color: var(--text-primary);
  margin-bottom: 12px;
  font-weight: 600;
  transition: color var(--transition-speed) ease;
}

.card-description {
  font-size: 0.95em;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  transition: color var(--transition-speed) ease;
}

/* Responsive design */
@media (max-width: 768px) {
  .main-title {
    font-size: 2em;
    margin-bottom: 40px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .feature-card {
    padding: 20px;
    min-height: auto;
  }

  .card-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .feature-icon {
    width: 32px;
    height: 32px;
  }
}
</style>