<template>
  <div class="camera-view">
    <div class="camera-container">
      <div class="camera-header">
        <h2>Kiểm tra Camera</h2>
        <div class="camera-controls">
          <button 
            class="btn btn-primary" 
            @click="getCameraList"
            :disabled="isLoading"
          >
            <span class="icon refresh"></span>
            Lấy danh sách camera
          </button>
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
            <span class="icon camera-large"></span>
            <p>Chưa có camera được kích hoạt</p>
          </div>
        </div>
      </div>

      <div class="camera-actions">
        <label class="show-all-checkbox">
          <input 
            type="checkbox" 
            v-model="showAllCameras"
            @change="getCameraList"
          >
          Hiển thị tất cả camera
        </label>
        
        <button 
          class="btn btn-success" 
          @click="startCamera" 
          :disabled="!selectedCamera || isStreaming"
        >
          <span class="icon play"></span>
          Kiểm tra Camera
        </button>
        
        <button 
          class="btn btn-danger" 
          @click="stopCamera"
          :disabled="!isStreaming"
        >
          <span class="icon stop"></span>
          Dừng Camera
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const videoElement = ref(null)
const cameras = ref([])
const selectedCamera = ref('')
const isStreaming = ref(false)
const isLoading = ref(false)
const showAllCameras = ref(false)
let stream = null

const getCameraList = async () => {
  try {
    isLoading.value = true
    const devices = await navigator.mediaDevices.enumerateDevices()
    cameras.value = devices.filter(device => device.kind === 'videoinput')
    
    if (cameras.value.length && !selectedCamera.value) {
      selectedCamera.value = cameras.value[0].deviceId
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách camera:', error)
    alert('Không thể lấy danh sách camera. Vui lòng kiểm tra quyền truy cập.')
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
        deviceId: selectedCamera.value ? { exact: selectedCamera.value } : undefined
      }
    })
    
    if (videoElement.value) {
      videoElement.value.srcObject = stream
      isStreaming.value = true
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
}

onUnmounted(() => {
  stopCamera()
})

// Tự động lấy danh sách camera khi component được tạo
getCameraList()
</script>

<style scoped>
.camera-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.camera-container {
  background: var(--bg-primary);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 24px var(--shadow-color);
}

.camera-header {
  margin-bottom: 2rem;
}

.camera-header h2 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.camera-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.camera-select-wrapper {
  flex: 1;
  min-width: 250px;
}

.camera-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.camera-select:focus {
  border-color: var(--primary-color);
  outline: none;
}

.camera-preview-container {
  margin: 2rem 0;
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.camera-preview-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: var(--bg-secondary);
}

.camera-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn-success {
  background: var(--success-color);
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: var(--success-dark);
}

.btn-danger {
  background: var(--danger-color);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: var(--danger-dark);
}

.show-all-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  cursor: pointer;
}

.show-all-checkbox input {
  width: 18px;
  height: 18px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .camera-view {
    padding: 1rem;
  }

  .camera-container {
    padding: 1rem;
  }

  .camera-controls {
    flex-direction: column;
  }

  .camera-select-wrapper {
    width: 100%;
  }

  .camera-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 