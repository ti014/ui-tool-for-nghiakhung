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
          <div class="action-group">
            <label class="show-all-checkbox">
              <input 
                type="checkbox" 
                v-model="showAllCameras"
                @change="getCameraList"
              >
              <span class="checkbox-label">Hiển thị tất cả camera</span>
            </label>
          </div>
          <div class="action-group buttons">
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
    height: calc(100vh - 120px); /* Trừ đi chiều cao của header và footer */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
  
  .camera-container {
    width: 100%;
    max-width: 800px;
    height: 100%;
    max-height: 600px;
    background: #ffffff;
    border-radius: 16px;
    padding: 1.25rem;
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: 1.25rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .dark .camera-container {
    background: #2a2a2a;
  }
  
  .camera-header {
    margin-bottom: 0;
  }
  
  .camera-header h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #2a2a2a;
  }
  
  .dark .camera-header h2 {
    color: #ffffff;
  }
  
  .camera-controls {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    align-items: center;
  }
  
  .camera-select-wrapper {
    position: relative;
  }
  
  .camera-select {
    width: 100%;
    padding: 0.625rem 1rem;
    border-radius: 8px;
    border: 2px solid #e0e0e0;
    background: #ffffff;
    color: #2a2a2a;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232a2a2a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1em;
    padding-right: 2.5rem;
  }
  
  .dark .camera-select {
    background-color: #3a3a3a;
    border-color: #4a4a4a;
    color: #ffffff;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  }
  
  .camera-preview-container {
    background: #f5f5f5;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
  }
  
  .dark .camera-preview-container {
    background: #1a1a1a;
  }
  
  .camera-preview-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 300px;
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
    border-radius: 12px;
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
    color: #666666;
    gap: 0.75rem;
  }
  
  .dark .camera-placeholder {
    color: #999999;
  }
  
  .camera-actions {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    align-items: center;
  }
  
  .action-group {
    display: flex;
    gap: 1rem;
  }
  
  .action-group.buttons {
    justify-content: flex-end;
  }
  
  .btn {
    padding: 0.625rem 1.25rem;
    border-radius: 8px;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  
  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .btn-primary {
    background: #2196f3;
    color: #ffffff;
  }
  
  .btn-primary:hover:not(:disabled) {
    background: #1976d2;
  }
  
  .btn-success {
    background: #4caf50;
    color: #ffffff;
  }
  
  .btn-success:hover:not(:disabled) {
    background: #388e3c;
  }
  
  .btn-danger {
    background: #f44336;
    color: #ffffff;
  }
  
  .btn-danger:hover:not(:disabled) {
    background: #d32f2f;
  }
  
  .show-all-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
  }
  
  .checkbox-label {
    color: #2a2a2a;
    font-size: 0.875rem;
  }
  
  .dark .checkbox-label {
    color: #ffffff;
  }
  
  .show-all-checkbox input {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 2px solid #2196f3;
    appearance: none;
    cursor: pointer;
    position: relative;
    background: #ffffff;
  }
  
  .dark .show-all-checkbox input {
    background: #3a3a3a;
  }
  
  .show-all-checkbox input:checked {
    background: #2196f3;
  }
  
  .show-all-checkbox input:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
    font-size: 10px;
  }
  
  @media (max-width: 768px) {
    .camera-view {
      padding: 0.75rem;
      height: calc(100vh - 100px);
    }
  
    .camera-container {
      padding: 1rem;
      gap: 1rem;
    }
  
    .camera-controls {
      grid-template-columns: 1fr;
    }
  
    .camera-actions {
      grid-template-columns: 1fr;
    }
  
    .action-group.buttons {
      justify-content: stretch;
      flex-direction: column;
    }
  
    .btn {
      width: 100%;
    }
  }
  </style>