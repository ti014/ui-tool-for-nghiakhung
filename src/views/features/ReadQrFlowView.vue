<template>
  <div class="qr-flow-container">
    <div class="qr-header">
      <img src="@/assets/icons/fis-logo.svg" alt="FPT IS" class="qr-logo" @click="goToSelectAuth" />
      <h1 class="qr-title">Quét mã QR/QBar</h1>
      <p class="qr-subtitle">Đặt mã QR hoặc QBar vào khung quét để xác thực</p>
      <div class="scan-note">
        <div class="note-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>
        <span>Hệ thống tự động nhận diện cả mã QR và QBar</span>
      </div>
    </div>

    <div class="qr-content">
      <div class="qr-scanner-container">
        <div class="scanner-frame">
          <div class="scanner-corner top-left"></div>
          <div class="scanner-corner top-right"></div>
          <div class="scanner-corner bottom-left"></div>
          <div class="scanner-corner bottom-right"></div>
          <div class="scanner-line"></div>
        </div>
        <div v-if="countdown > 0" class="countdown-overlay">
          <div class="countdown-text">Vui lòng đưa thẻ QR hoặc QBar lên khu vực quét sau</div>
          <div class="countdown-number">{{ countdown }}</div>
        </div>
      </div>
    </div>

    <div class="qr-footer">
      <button class="back-button" @click="goToSelectAuth">
        <span class="button-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </span>
        <span>Quay lại</span>
      </button>
    </div>

    <!-- Popup kết quả -->
    <div v-if="showResult" class="result-popup">
      <div class="result-popup-content">
        <div class="result-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="result-text">Đã quét thành công!</div>
        <div class="result-info">
          <div class="info-item">
            <span class="info-label">Loại mã:</span>
            <span class="info-value">{{ detectedType === 'qr' ? 'QR Code' : 'QBar Code' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Nội dung:</span>
            <span class="info-value">{{ qrContent }}</span>
          </div>
        </div>
        <button class="back-button" @click="goToSelectAuth" style="margin-top: 1.5rem; width: 100%;">
          <span class="button-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </span>
          <span>Quay lại</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const countdown = ref(5)
const showResult = ref(false)
const detectedType = ref('qr')
const qrContent = ref('https://example.com/qr-data')
const scanTime = ref('')

function goToSelectAuth() {
  router.replace('/guest-mode/select-auth')
}
onMounted(() => {
  const timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(timer)
      showResult.value = true
      // Giả lập kết quả quét
      detectedType.value = Math.random() > 0.5 ? 'qr' : 'qbar'
      scanTime.value = new Date().toLocaleTimeString('vi-VN')
      // Bỏ tự động chuyển trang
      // setTimeout(() => {
      //   router.push({ name: 'SelectAuthMethodView' })
      // }, 5000)
    }
  }, 1000)
})
</script>

<style scoped>
.qr-flow-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #e0e7ef 0%, #f8fafc 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: Arial, Tahoma, Verdana, 'Segoe UI', sans-serif;
}

.qr-header {
  text-align: center;
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, #e0e7ef 0%, #f8fafc 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.qr-logo {
  width: 120px;
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.qr-logo:hover {
  transform: scale(1.05);
}

.qr-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #4285f4;
  margin-bottom: 0.5rem;
}

.qr-subtitle {
  font-size: 1.2rem;
  color: #888;
}

.scan-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: rgba(66, 133, 244, 0.1);
  border-radius: 12px;
  color: #4285f4;
  font-size: 0.95rem;
  font-weight: 500;
}

.note-icon {
  display: flex;
  align-items: center;
  color: #4285f4;
}

.qr-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
}

.qr-scanner-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.85);
  border: 1.5px solid #e3e3e3;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 8px 32px 0 rgba(33,150,243,0.10), 0 2px 12px rgba(255,152,0,0.07);
  backdrop-filter: blur(6px);
}

.scanner-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  border: 2px solid rgba(33,150,243,0.2);
  border-radius: 16px;
}

.scanner-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border-color: #4285f4;
  border-style: solid;
  border-width: 0;
}

.top-left {
  top: -2px;
  left: -2px;
  border-top-width: 3px;
  border-left-width: 3px;
  border-top-left-radius: 8px;
}

.top-right {
  top: -2px;
  right: -2px;
  border-top-width: 3px;
  border-right-width: 3px;
  border-top-right-radius: 8px;
}

.bottom-left {
  bottom: -2px;
  left: -2px;
  border-bottom-width: 3px;
  border-left-width: 3px;
  border-bottom-left-radius: 8px;
}

.bottom-right {
  bottom: -2px;
  right: -2px;
  border-bottom-width: 3px;
  border-right-width: 3px;
  border-bottom-right-radius: 8px;
}

.scanner-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4285f4, transparent);
  animation: scan 2s linear infinite;
  box-shadow: 0 0 8px rgba(66, 133, 244, 0.5);
}

.countdown-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #4285f4;
  z-index: 2;
  backdrop-filter: blur(5px);
  border-radius: 28px;
}

.countdown-text {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 500;
  color: #4285f4;
  padding: 0 2rem;
}

.countdown-number {
  font-size: 4rem;
  font-weight: bold;
  color: #4285f4;
  animation: pulse 1s infinite;
  text-shadow: 0 0 20px rgba(66, 133, 244, 0.2);
}

.qr-footer {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #e0e7ef 0%, #f8fafc 100%);
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #4285f4;
  background: white;
  border: 1.5px solid #e3e3e3;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(33,150,243,0.10);
}

.back-button:hover {
  background: #4285f4;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(33,150,243,0.20);
}

.button-icon {
  display: flex;
  align-items: center;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes scan {
  0% {
    top: 0;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

.result-popup {
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
  animation: fadeIn 0.3s ease-out;
}

.result-popup-content {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  width: 95%;
  max-width: 600px;
  min-width: 320px;
  animation: scaleIn 0.3s ease-out;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.result-icon {
  color: #4CAF50;
  margin-bottom: 1.5rem;
}

.result-icon svg {
  width: 48px;
  height: 48px;
  filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.2));
}

.result-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #4285f4;
  margin-bottom: 1.5rem;
}

.result-info {
  background: #f8fafc;
  border: 1px solid #e3e3e3;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: left;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4285f4;
}

.info-value {
  font-size: 1.1rem;
  color: #444;
  word-break: break-word;
  white-space: pre-line;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e3e3e3;
  min-height: 80px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  text-align: left;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .result-popup-content {
    padding: 1.5rem;
  }

  .result-text {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .result-info {
    padding: 1rem;
  }

  .info-value {
    font-size: 1rem;
  }
}
</style> 