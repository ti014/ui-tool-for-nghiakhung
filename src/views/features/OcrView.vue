<template>
  <MainLayout>
    <div class="ocr-container">
      <div class="ocr-header">
        <div class="header-content">
          <div class="header-left">
            <h2 class="ocr-title">QR Scanner</h2>
            <p class="ocr-subtitle">Quét và đọc mã QR từ thiết bị camera</p>
          </div>
          <div class="header-right">
            <div class="device-input-group">
              <div class="device-selector">
                <div class="select-wrapper" @click="toggleDeviceList">
                  <div class="select-display">
                    <span class="select-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    </span>
                    <span class="select-text">{{ selectedDevice ? 'Thiết bị đã chọn' : 'Chọn thiết bị' }}</span>
                  </div>
                  <span class="select-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </div>
                <div class="device-list" v-if="showDeviceList">
                  <div class="device-item" v-for="device in devices" :key="device.deviceId" @click="selectDevice(device)">
                    <span class="device-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    </span>
                    {{ device.label }}
                  </div>
                </div>
              </div>
              <div class="scan-buttons">
                <button class="scan-button" @click="startManualScan" :disabled="isScanning || isAutoScanning">
                  <span class="button-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <line x1="3" y1="9" x2="21" y2="9"/>
                      <line x1="9" y1="21" x2="9" y2="9"/>
                    </svg>
                  </span>
                  {{ isScanning ? 'Đang quét...' : 'Quét' }}
                </button>
                <button class="scan-button auto" @click="startAutoScan" :disabled="isScanning || isAutoScanning">
                  <span class="button-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polygon points="10 8 16 12 10 16 10 8"/>
                    </svg>
                  </span>
                  {{ isAutoScanning ? 'Đang quét tự động...' : 'Quét tự động' }}
                </button>
                <button class="scan-button stop" @click="stopScanning" :disabled="!isScanning && !isAutoScanning">
                  <span class="button-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="6" y="6" width="12" height="12" rx="2" ry="2"/>
                    </svg>
                  </span>
                  Dừng quét
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Thanh tiến trình -->
      <div class="progress-container" v-if="isScanning || isAutoScanning">
        <div class="progress-bar">
          <div class="progress-fill" :class="{ auto: isAutoScanning }" :style="{ width: (isScanning ? scanProgress : autoScanProgress) + '%' }">
            <div class="progress-glow"></div>
            <div class="progress-particles"></div>
          </div>
        </div>
        <div class="progress-info">
          <span class="progress-text">{{ isScanning ? scanProgress : autoScanProgress }}%</span>
          <span class="progress-status">{{ isScanning ? 'Đang quét mã QR...' : 'Đang quét tự động...' }}</span>
        </div>
      </div>

      <!-- Tùy chọn hiển thị -->
      <div class="ocr-section">
        <div class="section-header">
          <h3>Tùy chọn hiển thị</h3>
        </div>
        <div class="display-options">
          <div class="display-tabs">
            <button 
              v-for="option in displayOptions" 
              :key="option.id"
              :class="['display-tab', { active: activeDisplay === option.id }]"
              @click="activeDisplay = option.id"
            >
              {{ option.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Khu vực hiển thị dữ liệu -->
      <div class="ocr-section data-section">
        <div class="data-container">
          <!-- Log -->
          <div v-if="activeDisplay === 'log'" class="data-pane">
            <div class="log-container">
              <div v-for="(log, index) in logs" :key="index" class="log-entry" :class="log.type">
                <span class="log-time">{{ log.time }}</span>
                <span class="log-message">{{ log.message }}</span>
              </div>
            </div>
          </div>

          <!-- Dữ liệu đọc được -->
          <div v-if="activeDisplay === 'qr'" class="data-pane">
            <div class="data-card">
              <div class="data-header">
                <div class="data-type">
                  <span class="type-text">QR Code</span>
                </div>
                <div class="data-time">{{ scannedData.qr[0]?.time || '--:--:--' }}</div>
              </div>
              <div class="data-content">
                <div class="content-text">{{ scannedData.qr[0]?.content || 'Chưa có dữ liệu' }}</div>
                <div class="content-actions">
                  <button class="action-button copy" @click="copyContent('qr')">
                    <span class="action-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                    </span>
                    Sao chép
                  </button>
                  <button class="action-button download" @click="downloadContent('qr')">
                    <span class="action-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </span>
                    Tải xuống
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Barcode -->
          <div v-if="activeDisplay === 'barcode'" class="data-pane">
            <div class="data-card">
              <div class="data-header">
                <div class="data-type">
                  <span class="type-text">Barcode</span>
                </div>
                <div class="data-time">{{ scannedData.barcode[0]?.time || '--:--:--' }}</div>
              </div>
              <div class="data-content">
                <div class="content-text">{{ scannedData.barcode[0]?.content || 'Chưa có dữ liệu' }}</div>
                <div class="content-actions">
                  <button class="action-button copy" @click="copyContent('barcode')">
                    <span class="action-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                    </span>
                    Sao chép
                  </button>
                  <button class="action-button download" @click="downloadContent('barcode')">
                    <span class="action-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </span>
                    Tải xuống
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- MRZ -->
          <div v-if="activeDisplay === 'mrz'" class="data-pane">
            <div class="data-card">
              <div class="data-header">
                <div class="data-type">
                  <span class="type-text">MRZ</span>
                </div>
                <div class="data-time">{{ scannedData.mrz[0]?.time || '--:--:--' }}</div>
              </div>
              <div class="data-content">
                <div class="content-text">{{ scannedData.mrz[0]?.content || 'Chưa có dữ liệu' }}</div>
                <div class="content-actions">
                  <button class="action-button copy" @click="copyContent('mrz')">
                    <span class="action-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                    </span>
                    Sao chép
                  </button>
                  <button class="action-button download" @click="downloadContent('mrz')">
                    <span class="action-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </span>
                    Tải xuống
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import MainLayout from '@/components/layouts/MainLayout.vue'

export default {
  name: 'OCRView',
  components: {
    MainLayout
  },
  setup() {
    const selectedDevice = ref('')
    const devices = ref([])
    const isScanning = ref(false)
    const isAutoScanning = ref(false)
    const scanProgress = ref(0)
    const autoScanProgress = ref(0)
    const showDeviceList = ref(false)
    const videoPreview = ref(null)

    const displayOptions = [
      { id: 'log', name: 'Log' },
      { id: 'qr', name: 'QR Code' },
      { id: 'barcode', name: 'Barcode' },
      { id: 'mrz', name: 'MRZ' }
    ]

    const activeDisplay = ref('log')
    const logs = ref([
      { time: '10:30:15', message: 'Đã kết nối camera', type: 'info' },
      { time: '10:30:20', message: 'Bắt đầu quét', type: 'success' },
      { time: '10:30:25', message: 'Đã quét thành công', type: 'success' }
    ])

    const scannedData = ref({
      qr: [],
      barcode: [],
      mrz: []
    })

    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        return devices.filter(device => device.kind === 'videoinput')
      } catch (error) {
        console.error('Error getting devices:', error)
        return []
      }
    }

    const startManualScan = () => {
      if (isScanning.value || isAutoScanning.value) return
      
      isScanning.value = true
      scanProgress.value = 0
      
      const interval = setInterval(() => {
        scanProgress.value += 2
        if (scanProgress.value >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            isScanning.value = false
            const newData = {
              time: new Date().toLocaleTimeString(),
              type: activeDisplay.value,
              content: `Sample ${activeDisplay.value.toUpperCase()} Content`,
              image: 'data:image/png;base64,...' // Thay bằng ảnh thực tế
            }
            scannedData.value[activeDisplay.value].unshift(newData)
            logs.value.unshift({
              time: new Date().toLocaleTimeString(),
              message: `Đã quét thành công ${activeDisplay.value.toUpperCase()}`,
              type: 'success'
            })
          }, 500)
        }
      }, 50)
    }

    const startAutoScan = () => {
      if (isScanning.value || isAutoScanning.value) return
      
      isAutoScanning.value = !isAutoScanning.value
      if (isAutoScanning.value) {
        autoScanProgress.value = 0
        const interval = setInterval(() => {
          autoScanProgress.value += 1
          if (autoScanProgress.value >= 100) {
            autoScanProgress.value = 0
            const newData = {
              time: new Date().toLocaleTimeString(),
              type: activeDisplay.value,
              content: `Auto Scanned ${activeDisplay.value.toUpperCase()} Content`,
              image: 'data:image/png;base64,...' // Thay bằng ảnh thực tế
            }
            scannedData.value[activeDisplay.value].unshift(newData)
            logs.value.unshift({
              time: new Date().toLocaleTimeString(),
              message: `Đã quét tự động ${activeDisplay.value.toUpperCase()}`,
              type: 'success'
            })
          }
        }, 50)
      }
    }

    const stopScanning = () => {
      isScanning.value = false
      isAutoScanning.value = false
      scanProgress.value = 0
      autoScanProgress.value = 0
    }

    const toggleDeviceList = () => {
      showDeviceList.value = !showDeviceList.value
    }

    const selectDevice = (device) => {
      selectedDevice.value = device.deviceId
      showDeviceList.value = false
    }

    const copyContent = (type) => {
      if (scannedData.value[type][0]?.content) {
        navigator.clipboard.writeText(scannedData.value[type][0].content)
      }
    }

    const downloadContent = (type) => {
      if (scannedData.value[type][0]?.content) {
        const blob = new Blob([scannedData.value[type][0].content], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `qr-content-${new Date().toISOString()}.txt`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    }

    onMounted(async () => {
      devices.value = await getDevices()
      if (devices.value.length > 0) {
        selectedDevice.value = devices.value[0].deviceId
      }
    })

    return {
      selectedDevice,
      devices,
      isScanning,
      isAutoScanning,
      scanProgress,
      autoScanProgress,
      showDeviceList,
      toggleDeviceList,
      selectDevice,
      videoPreview,
      displayOptions,
      activeDisplay,
      logs,
      scannedData,
      startManualScan,
      startAutoScan,
      stopScanning,
      copyContent,
      downloadContent
    }
  }
}
</script>

<style scoped>
.ocr-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.ocr-header {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.header-left {
  flex: 0 0 auto;
}

.header-right {
  flex: 1;
  max-width: 800px;
}

.ocr-title {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.ocr-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}

.device-input-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

.device-selector {
  flex: 0 0 auto;
  min-width: 200px;
  max-width: 250px;
}

.select-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-wrapper:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.select-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.select-icon {
  color: var(--primary-color);
}

.select-text {
  color: var(--text-primary);
  font-size: 1rem;
}

.select-arrow {
  color: var(--text-secondary);
  transition: transform 0.3s ease;
}

.select-wrapper:hover .select-arrow {
  transform: translateY(2px);
}

.device-list {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
  animation: slideDown 0.3s ease;
}

.device-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.device-item:hover {
  background: var(--bg-secondary);
  color: var(--primary-color);
}

.device-icon {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-right {
    width: 100%;
  }

  .device-input-group {
    flex-direction: column;
    width: 100%;
  }

  .device-selector {
    width: 100%;
  }

  .scan-buttons {
    flex-direction: column;
    width: 100%;
  }

  .scan-button {
    width: 100%;
  }
}

.ocr-section {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.ocr-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

/* Tabs styling */
.tabs-container {
  width: 100%;
}

.tab-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 1rem;
}

.scan-buttons {
  display: flex;
  gap: 1rem;
  flex: 1;
  justify-content: flex-end;
}

.scan-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color, #7C9CBF);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  user-select: none;
  position: relative;
  z-index: 2;
}

.scan-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: var(--primary-dark, #6B8BAF);
}

.scan-button.auto {
  background: var(--info-color, #A5D8FF);
}

.scan-button.auto:hover:not(:disabled) {
  background: var(--info-dark, #95C8EF);
}

.scan-button.stop {
  background: var(--danger-color, #FFB4B4);
}

.scan-button.stop:hover:not(:disabled) {
  background: var(--danger-dark, #FFA4A4);
}

.scan-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.scan-button:hover:not(:disabled) .button-icon {
  transform: scale(1.1);
}

/* Progress styling */
.progress-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
  position: relative;
  z-index: 1;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  pointer-events: none;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
  pointer-events: none;
}

.progress-fill.auto {
  background: linear-gradient(90deg, var(--primary-light), var(--primary-color));
}

.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: glow 1.5s infinite;
  pointer-events: none;
}

.progress-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, transparent 50%),
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.8) 0%, transparent 50%);
  background-size: 200% 200%;
  animation: particles 2s linear infinite;
  pointer-events: none;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
  pointer-events: none;
}

.progress-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-color);
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  -webkit-text-fill-color: transparent;
  pointer-events: none;
}

.progress-status {
  font-size: 0.9rem;
  color: var(--text-secondary);
  pointer-events: none;
}

@keyframes glow {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes particles {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 200%;
  }
}

/* Display options styling */
.display-options {
  margin-top: 1rem;
}

.display-tabs {
  display: flex;
  gap: 1rem;
}

.display-tab {
  padding: 0.75rem 1.5rem;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.display-tab:hover {
  background: var(--primary-light);
}

.display-tab.active {
  background: var(--primary-color);
  color: white;
}

/* Data section styling */
.data-section {
  min-height: 400px;
}

.data-container {
  height: 100%;
}

.data-pane {
  height: 100%;
}

.log-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.log-entry {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.log-entry.info {
  background: rgba(66, 153, 225, 0.1);
}

.log-entry.success {
  background: rgba(72, 187, 120, 0.1);
}

.log-entry.error {
  background: rgba(245, 101, 101, 0.1);
}

.log-time {
  color: var(--text-secondary);
  min-width: 80px;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.data-card {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.data-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.data-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.data-type[data-type="qr"] {
  color: var(--primary-color);
}

.data-type[data-type="barcode"] {
  color: var(--info-color);
}

.data-type[data-type="mrz"] {
  color: var(--light-orange);
}

.type-text {
  font-size: 1.1rem;
}

.data-time {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.data-content {
  padding: 1.5rem;
}

.content-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-primary);
  word-break: break-all;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.content-actions {
  display: flex;
  gap: 1rem;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  background: var(--primary-color, #7C9CBF);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: var(--primary-dark, #6B8BAF);
}

.action-button:active {
  transform: translateY(0);
}

.action-button.copy {
  background: var(--primary-color, #7C9CBF);
}

.action-button.download {
  background: var(--info-color, #A5D8FF);
}

.action-button.download:hover {
  background: var(--info-dark, #95C8EF);
}

.action-button.download:active {
  transform: translateY(0);
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Scan controls styling */
.scan-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.scan-buttons {
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.scan-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color, #7C9CBF);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  user-select: none;
  position: relative;
  z-index: 2;
}

.scan-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: var(--primary-dark, #6B8BAF);
}

.scan-button.auto {
  background: var(--info-color, #A5D8FF);
}

.scan-button.auto:hover:not(:disabled) {
  background: var(--info-dark, #95C8EF);
}

.scan-button.stop {
  background: var(--danger-color, #FFB4B4);
}

.scan-button.stop:hover:not(:disabled) {
  background: var(--danger-dark, #FFA4A4);
}

.scan-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.scan-button:hover:not(:disabled) .button-icon {
  transform: scale(1.1);
}

/* Progress styling */
.progress-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}

.qr-data-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 2rem;
}

.qr-data-item {
  width: 100%;
  max-width: 600px;
  background: var(--bg-primary);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.qr-preview {
  padding: 2rem;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-color);
}

.qr-image-wrapper {
  width: 100%;
  max-width: 250px;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qr-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1.5rem;
}

.qr-overlay {
  display: none;
}

.qr-info {
  padding: 2rem;
}

.qr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.qr-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  font-weight: 500;
  font-size: 1.1rem;
}

.qr-time {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.qr-content {
  margin-bottom: 1.5rem;
}

.content-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.content-text {
  background: var(--bg-secondary);
  padding: 1.25rem;
  border-radius: 12px;
  font-size: 1.1rem;
  line-height: 1.6;
  word-break: break-all;
  border: 1px solid var(--border-color);
  min-height: 80px;
}

.qr-actions {
  display: flex;
  justify-content: center;
}

.qr-button {
  width: 200px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  background: var(--primary-color, #7C9CBF);
}

.qr-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: var(--primary-dark, #6B8BAF);
}

.qr-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .qr-data-container {
    padding: 1rem;
  }

  .qr-preview {
    padding: 1.5rem;
  }

  .qr-info {
    padding: 1.5rem;
  }

  .qr-button {
    width: 100%;
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin: 0;
}
</style>
