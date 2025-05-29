<template>
  <MainLayout>
    <div class="camera-container">
      <div class="camera-section">
        <div class="section-content">
          <div class="section-left">
            <h2 class="section-title">Kiểm tra Camera</h2>
            <p class="section-subtitle">Quản lý và kiểm tra trạng thái camera</p>
          </div>
          <div class="section-right">
            <div class="camera-controls">
              <div class="camera-select-wrapper">
                <select 
                  v-model="selectedCamera" 
                  class="camera-select"
                  :disabled="!cameras.length"
                >
                  <option value="">Chọn camera</option>
                  <option 
                    v-for="camera in cameras" 
                    :key="camera.deviceId" 
                    :value="camera.deviceId"
                  >
                    {{ camera.label || `Camera ${camera.deviceId.slice(0, 8)}...` }}
                  </option>
                </select>
              </div>
              <button 
                class="camera-button" 
                @click="getCameraList"
                :disabled="isLoading"
              >
                {{ isLoading ? 'Đang tải...' : 'Lấy danh sách' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="camera-preview-container">
        <div class="camera-preview-wrapper">
          <video 
            ref="videoElement" 
            class="camera-preview" 
            :class="{ active: isStreaming }"
            autoplay 
            playsinline
          ></video>
          <div v-if="!isStreaming" class="camera-placeholder">
            <p>Chưa có camera được kích hoạt</p>
          </div>
          <div v-if="isStreaming" class="camera-overlay">
            <div class="camera-info">
              <span class="resolution">{{ currentResolution }}</span>
              <span class="fps">{{ currentFps }} FPS</span>
            </div>
          </div>
        </div>
      </div>

      <div class="camera-actions">
        <div class="action-buttons">
          <button 
            class="action-button primary" 
            @click="startCamera" 
            :disabled="!selectedCamera || isStreaming"
          >
            {{ isStreaming ? 'Đang chạy...' : 'Kiểm tra Camera' }}
          </button>
          
          <button 
            class="action-button danger" 
            @click="stopCamera"
            :disabled="!isStreaming"
          >
            Dừng Camera
          </button>

          <button 
            class="action-button success" 
            @click="captureImage"
            :disabled="!isStreaming"
          >
            Chụp ảnh
          </button>

          <button 
            class="action-button info" 
            @click="switchCamera"
            :disabled="!hasMultipleCameras || !isStreaming"
          >
            Chuyển Camera
          </button>
        </div>
      </div>

      <div v-if="capturedImage" class="captured-image-container">
        <div class="captured-image-header">
          <h3>Ảnh đã chụp</h3>
          <div class="captured-image-actions">
            <button 
              class="action-button info" 
              @click="saveImage"
            >
              Lưu ảnh
            </button>
            <button 
              class="action-button danger" 
              @click="clearCapturedImage"
            >
              Xóa ảnh
            </button>
          </div>
        </div>
        <div class="captured-image">
          <img :src="capturedImage" alt="Captured image" />
        </div>
      </div>

      <!-- Error Dialog -->
      <div v-if="showError" class="error-dialog">
        <div class="error-content">
          <h3>Lỗi</h3>
          <p>{{ errorMessage }}</p>
          <div class="error-actions">
            <button @click="retryLastAction" class="action-button primary">Thử lại</button>
            <button @click="closeError" class="action-button danger">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue'
import MainLayout from '@/components/layouts/MainLayout.vue'

// Refs
const videoElement = ref(null)
const cameras = ref([])
const selectedCamera = ref('')
const isStreaming = ref(false)
const isLoading = ref(false)
const capturedImage = ref(null)
const currentResolution = ref('')
const currentFps = ref(0)
const showError = ref(false)
const errorMessage = ref('')
const lastAction = ref(null)

// Canvas for image capture
const canvas = ref(null)

// Stream management
let stream = null
let fpsInterval = null
let frameCount = 0
let lastTime = 0

// Computed
const hasMultipleCameras = computed(() => cameras.value.length > 1)

// Check browser compatibility
const checkBrowserCompatibility = () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Trình duyệt của bạn không hỗ trợ truy cập camera')
  }
}

// Error handling
const handleError = (error, action) => {
  console.error('Camera error:', error)
  errorMessage.value = error.message || 'Đã xảy ra lỗi không xác định'
  showError.value = true
  lastAction.value = action
}

const closeError = () => {
  showError.value = false
  errorMessage.value = ''
  lastAction.value = null
}

const retryLastAction = () => {
  if (lastAction.value) {
    closeError()
    lastAction.value()
  }
}

// FPS counter
const startFpsCounter = () => {
  frameCount = 0
  lastTime = performance.now()
  fpsInterval = setInterval(() => {
    const currentTime = performance.now()
    const elapsed = currentTime - lastTime
    currentFps.value = Math.round((frameCount * 1000) / elapsed)
    frameCount = 0
    lastTime = currentTime
  }, 1000)
}

const stopFpsCounter = () => {
  if (fpsInterval) {
    clearInterval(fpsInterval)
    fpsInterval = null
  }
  currentFps.value = 0
}

// Resolution tracking
const updateResolution = () => {
  if (videoElement.value) {
    currentResolution.value = `${videoElement.value.videoWidth}x${videoElement.value.videoHeight}`
  }
}

// Camera list management
const getCameraList = async () => {
  try {
    isLoading.value = true
    checkBrowserCompatibility()

    // Get device list first
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter(device => device.kind === 'videoinput')
    
    if (videoDevices.length === 0) {
      throw new Error('Không tìm thấy camera nào trên thiết bị')
    }

    cameras.value = videoDevices
    
    // Request permission only if needed
    if (!selectedCamera.value) {
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true })
        tempStream.getTracks().forEach(track => track.stop())
        selectedCamera.value = cameras.value[0].deviceId
      } catch (error) {
        throw new Error('Vui lòng cấp quyền truy cập camera để tiếp tục')
      }
    }

    console.log('Danh sách camera:', cameras.value)
  } catch (error) {
    handleError(error, getCameraList)
  } finally {
    isLoading.value = false
  }
}

// Camera control
const startCamera = async () => {
  try {
    checkBrowserCompatibility()
    
    // Stop existing stream if any
    await stopCamera()

    // Create new stream
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: selectedCamera.value ? { exact: selectedCamera.value } : undefined,
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    })
    
    if (videoElement.value) {
      videoElement.value.srcObject = stream
      isStreaming.value = true
      startFpsCounter()
      updateResolution()
      
      // Update resolution on video metadata loaded
      videoElement.value.onloadedmetadata = () => {
        updateResolution()
      }
    }
  } catch (error) {
    handleError(error, startCamera)
  }
}

const stopCamera = async () => {
  try {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      stream = null
    }
    if (videoElement.value) {
      videoElement.value.srcObject = null
    }
    isStreaming.value = false
    capturedImage.value = null
    stopFpsCounter()
    currentResolution.value = ''
  } catch (error) {
    handleError(error, stopCamera)
  }
}

// Image capture
const captureImage = () => {
  try {
    if (!videoElement.value || !isStreaming.value) return

    // Create canvas if not exists
    if (!canvas.value) {
      canvas.value = document.createElement('canvas')
    }

    // Update canvas dimensions
    canvas.value.width = videoElement.value.videoWidth
    canvas.value.height = videoElement.value.videoHeight
    
    const context = canvas.value.getContext('2d')
    context.drawImage(videoElement.value, 0, 0, canvas.value.width, canvas.value.height)
    
    capturedImage.value = canvas.value.toDataURL('image/png')
  } catch (error) {
    handleError(error, captureImage)
  }
}

// Camera switching
const switchCamera = () => {
  try {
    if (!hasMultipleCameras.value) return

    const currentIndex = cameras.value.findIndex(cam => cam.deviceId === selectedCamera.value)
    const nextIndex = (currentIndex + 1) % cameras.value.length
    selectedCamera.value = cameras.value[nextIndex].deviceId

    startCamera()
  } catch (error) {
    handleError(error, switchCamera)
  }
}

// Image saving
const saveImage = () => {
  try {
    if (!capturedImage.value) return

    const link = document.createElement('a')
    link.href = capturedImage.value
    link.download = `camera-capture-${new Date().toISOString()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    handleError(error, saveImage)
  }
}

const clearCapturedImage = () => {
  capturedImage.value = null
}

// Lifecycle hooks
onMounted(() => {
  // Initialize canvas
  canvas.value = document.createElement('canvas')
  
  // Check browser compatibility on mount
  try {
    checkBrowserCompatibility()
  } catch (error) {
    handleError(error)
  }
})

onUnmounted(() => {
  // Cleanup
  stopCamera()
  if (canvas.value) {
    canvas.value = null
  }
  if (fpsInterval) {
    clearInterval(fpsInterval)
  }
})
</script>

<style scoped>
.camera-container {
  padding: 2rem;
  background: var(--bg-secondary);
  min-height: calc(100vh - var(--nav-height) - var(--footer-height));
}

.camera-section {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.section-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.section-left {
  flex: 0 0 auto;
}

.section-right {
  flex: 1;
  max-width: 800px;
}

.section-title {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}

.camera-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.camera-select-wrapper {
  flex: 0 0 auto;
  min-width: 200px;
}

.camera-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.camera-select:hover:not(:disabled) {
  border-color: var(--primary-color);
}

.camera-select:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.camera-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: var(--primary-color);
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.camera-button:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.camera-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.camera-preview-container {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.camera-preview-wrapper {
  position: relative;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  aspect-ratio: 16/9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.camera-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.camera-preview.active {
  opacity: 1;
}

.camera-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.camera-info {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: white;
  font-size: 0.875rem;
  display: flex;
  gap: 1rem;
}

.camera-actions {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-button.primary {
  background-color: var(--primary-color);
  color: white;
}

.action-button.primary:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.action-button.danger {
  background-color: var(--danger-color);
  color: white;
}

.action-button.danger:hover:not(:disabled) {
  background-color: var(--danger-dark);
}

.action-button.success {
  background-color: #ff9800;
  color: white;
}

.action-button.success:hover:not(:disabled) {
  background-color: #f57c00;
}

.action-button.info {
  background-color: var(--info-color);
  color: white;
}

.action-button.info:hover:not(:disabled) {
  background-color: var(--info-dark);
}

.captured-image-container {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.captured-image-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.captured-image-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.2rem;
}

.captured-image-actions {
  display: flex;
  gap: 0.75rem;
}

.captured-image {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.captured-image img {
  width: 100%;
  border-radius: 8px;
  border: 2px solid var(--border-color);
}

.error-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.error-content {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.error-content h3 {
  color: var(--danger-color);
  margin: 0 0 1rem 0;
}

.error-content p {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

@media (max-width: 768px) {
  .section-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .section-right {
    width: 100%;
  }

  .camera-controls {
    flex-direction: column;
    width: 100%;
  }

  .camera-select-wrapper {
    width: 100%;
  }

  .camera-button {
    width: 100%;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }

  .captured-image-header {
    flex-direction: column;
    gap: 1rem;
  }

  .captured-image-actions {
    width: 100%;
    flex-direction: column;
  }

  .error-content {
    width: 95%;
    margin: 1rem;
  }
}
</style>