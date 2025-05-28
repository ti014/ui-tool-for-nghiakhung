<template>
  <MainLayout>
    <div class="camera-container">
      <div class="camera-header">
        <div class="header-content">
          <div class="header-left">
            <h2 class="camera-title">Kiểm tra Camera</h2>
            <p class="camera-subtitle">Quản lý và kiểm tra trạng thái camera</p>
          </div>
          <div class="header-right">
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
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue'
import MainLayout from '@/components/layouts/MainLayout.vue'

const videoElement = ref(null)
const cameras = ref([])
const selectedCamera = ref('')
const isStreaming = ref(false)
const isLoading = ref(false)
const capturedImage = ref(null)
const currentResolution = ref('')
const currentFps = ref(0)
let stream = null
let fpsInterval = null

const hasMultipleCameras = computed(() => cameras.value.length > 1)

const getCameraList = async () => {
  try {
    isLoading.value = true
    
    // Đầu tiên yêu cầu quyền truy cập camera
    await navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        // Dừng stream ngay sau khi có quyền truy cập
        stream.getTracks().forEach(track => track.stop())
      })
      .catch(error => {
        throw new Error('Không thể truy cập camera: ' + error.message)
      })

    // Sau đó lấy danh sách thiết bị
    const devices = await navigator.mediaDevices.enumerateDevices()
    cameras.value = devices.filter(device => device.kind === 'videoinput')
    
    if (cameras.value.length === 0) {
      alert('Không tìm thấy camera nào trên thiết bị')
    } else if (!selectedCamera.value) {
      selectedCamera.value = cameras.value[0].deviceId
    }

    console.log('Danh sách camera:', cameras.value)
  } catch (error) {
    console.error('Lỗi khi lấy danh sách camera:', error)
    alert(error.message || 'Không thể lấy danh sách camera. Vui lòng kiểm tra quyền truy cập.')
  } finally {
    isLoading.value = false
  }
}

const startCamera = async () => {
  try {
    if (stream) {
      stopCamera()
    }

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
    }
  } catch (error) {
    console.error('Lỗi khi khởi động camera:', error)
    alert('Không thể khởi động camera. Vui lòng thử lại.')
  }
}

const stopCamera = () => {
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
}

const captureImage = () => {
  if (!videoElement.value) return

  const canvas = document.createElement('canvas')
  canvas.width = videoElement.value.videoWidth
  canvas.height = videoElement.value.videoHeight
  
  const context = canvas.getContext('2d')
  context.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height)
  
  capturedImage.value = canvas.toDataURL('image/png')
}

const switchCamera = () => {
  if (!hasMultipleCameras.value) return

  const currentIndex = cameras.value.findIndex(cam => cam.deviceId === selectedCamera.value)
  const nextIndex = (currentIndex + 1) % cameras.value.length
  selectedCamera.value = cameras.value[nextIndex].deviceId

  // Restart camera with new selection
  startCamera()
}

const saveImage = () => {
  if (!capturedImage.value) return

  const link = document.createElement('a')
  link.href = capturedImage.value
  link.download = `camera-capture-${new Date().toISOString()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const clearCapturedImage = () => {
  capturedImage.value = null
}

const startFpsCounter = () => {
  let frameCount = 0
  let lastTime = performance.now()
  
  fpsInterval = setInterval(() => {
    const currentTime = performance.now()
    const elapsed = currentTime - lastTime
    
    if (elapsed >= 1000) {
      currentFps.value = Math.round((frameCount * 1000) / elapsed)
      frameCount = 0
      lastTime = currentTime
    }
    
    frameCount++
  }, 100)
}

const stopFpsCounter = () => {
  if (fpsInterval) {
    clearInterval(fpsInterval)
    fpsInterval = null
  }
  currentFps.value = 0
}

const updateResolution = () => {
  if (videoElement.value) {
    currentResolution.value = `${videoElement.value.videoWidth}x${videoElement.value.videoHeight}`
  }
}

// Thêm hàm để kiểm tra quyền truy cập camera
const checkCameraPermission = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const hasPermission = devices.some(device => device.kind === 'videoinput' && device.label)
    return hasPermission
  } catch (error) {
    console.error('Lỗi khi kiểm tra quyền camera:', error)
    return false
  }
}

// Tự động lấy danh sách camera khi component được tạo
onMounted(async () => {
  const hasPermission = await checkCameraPermission()
  if (hasPermission) {
    getCameraList()
  }
})

onUnmounted(() => {
  stopCamera()
})
</script>

<style scoped>
.camera-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.camera-header {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.camera-title {
  font-size: 2rem;
  color: #333333;
  margin-bottom: 0.5rem;
}

.camera-subtitle {
  color: #666666;
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
  max-width: 300px;
  position: relative;
}

.camera-select {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #ffffff;
  color: #333333;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.camera-select:hover:not(:disabled) {
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.camera-select:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.camera-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  height: 38px;
}

.camera-button:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.camera-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: #f5f5f5;
  color: #666666;
}

.camera-preview-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.camera-preview-wrapper {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.camera-preview {
  position: absolute;
  top: 0;
  left: 0;
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
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
}

.camera-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.action-button {
  min-width: 100px;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: #f5f5f5;
  color: #666666;
  transform: none;
  box-shadow: none;
}

.action-button.primary {
  background: #4CAF50;
}

.action-button.primary:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-button.danger {
  background: #f44336;
}

.action-button.danger:hover:not(:disabled) {
  background: #d32f2f;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-button.success {
  background: #2196F3;
}

.action-button.success:hover:not(:disabled) {
  background: #1976D2;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-button.info {
  background: #00BCD4;
}

.action-button.info:hover:not(:disabled) {
  background: #0097A7;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.captured-image-container {
  margin-top: 2rem;
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.captured-image-container h3 {
  color: #333333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.captured-image {
  display: flex;
  justify-content: center;
}

.captured-image img {
  max-width: 100%;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
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

.captured-image-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.captured-image-actions {
  display: flex;
  gap: 0.75rem;
}

.captured-image-actions .action-button {
  min-width: 90px;
}

@media (max-width: 768px) {
  .camera-container {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-right {
    width: 100%;
  }

  .camera-controls {
    flex-direction: column;
    width: 100%;
  }

  .camera-select-wrapper {
    width: 100%;
    max-width: none;
  }

  .camera-button {
    width: 100%;
  }

  .action-buttons {
    width: 100%;
    flex-wrap: wrap;
  }

  .action-button {
    flex: 1;
    min-width: calc(50% - 0.375rem);
  }

  .captured-image-container {
    margin-top: 1.5rem;
    padding: 1rem;
  }

  .captured-image-header {
    flex-direction: column;
    gap: 1rem;
  }

  .captured-image-actions {
    width: 100%;
  }

  .captured-image-actions .action-button {
    flex: 1;
  }
}
</style>