<template>
  <div class="cccd-flow-bg">
    <transition name="fade-slide" mode="out-in">
      <div class="cccd-flow-container" :key="step">
        <!-- Bước 1: Hướng dẫn đưa thẻ -->
        <div v-if="step === 1" class="cccd-step step-guide">
          <img :src="fisLogo" alt="FIS Logo" class="fis-logo-guide" @click="goToGuestMode" />
          <h2 class="cccd-title gradient-title">Vui lòng đưa thẻ căn cước công dân vào thiết bị theo đúng hướng dẫn</h2>
          <div class="gif-guide-wrapper">
            <img :src="gifKiosk" alt="Hướng dẫn đặt thẻ CCCD" class="cccd-guide-gif" />
          </div>
          <button class="cccd-btn primary" @click="startReading">
            <span class="btn-icon"><svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M5 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/></svg></span> Bắt đầu đọc thẻ
          </button>
        </div>

        <!-- Bước 2: Đang đọc thẻ -->
        <div v-else-if="step === 2" class="cccd-step step-processing">
          <div class="cccd-progress-icon">
            <svg width="64" height="64" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#43e97b" stroke-width="6" stroke-linecap="round" stroke-dasharray="31.4 31.4" stroke-dashoffset="0"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/></circle></svg>
          </div>
          <div class="cccd-progress-bar modern-bar">
            <div class="cccd-progress-fill" :style="{width: progress + '%'}"></div>
          </div>
          <div class="cccd-progress-label pulse">Đang đọc thẻ, vui lòng chờ...</div>
        </div>

        <!-- Bước 3: Chụp ảnh khuôn mặt -->
        <div v-else-if="step === 3" class="cccd-step step-camera">
          <div class="camera-center-wrapper">
            <div class="camera-container">
              <div class="cccd-camera-frame modern-camera-frame">
                <video ref="videoRef" class="camera-preview" autoplay playsinline></video>
                <div class="face-guide-frame">
                  <div class="face-guide-border"></div>
                  <div class="face-guide-corners">
                    <div class="corner top-left"></div>
                    <div class="corner top-right"></div>
                    <div class="corner bottom-left"></div>
                    <div class="corner bottom-right"></div>
                  </div>
                </div>
                <div v-if="countdown > 0" class="countdown-overlay">
                  <div class="countdown-content">
                    <div class="countdown-message">Chuẩn bị chụp sau</div>
                    <div class="countdown-number">{{ countdown }}</div>
                    <div class="countdown-unit">giây</div>
                  </div>
                </div>
                <img v-if="showPhotoPreview" :src="capturedPhoto" class="photo-preview-overlay" alt="Preview" />
                <canvas ref="canvasRef" class="camera-canvas" style="display: none;"></canvas>
              </div>
              <div class="camera-side-panel">
                <div class="camera-instructions">
                  Vui lòng đặt khuôn mặt vào trong khung hình
                  <div class="instruction-text small">Đảm bảo khuôn mặt được chiếu sáng đầy đủ</div>
                </div>
                <div class="camera-status">{{ cameraStatus }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bước 4: Hiển thị kết quả -->
        <div v-else-if="step === 4" class="cccd-step">
          <div class="result-container">
            <!-- Cột trái: 2 ảnh -->
            <div class="photo-column">
              <div class="photo-block">
                <div class="photo-frame">
                  <img :src="cccdData.photo" alt="Ảnh trên thẻ" v-if="cccdData.photo">
                  <div class="photo-placeholder" v-else>Chưa có ảnh</div>
                </div>
                <div class="photo-label">Ảnh trên CCCD</div>
              </div>
              <div class="photo-block">
                <div class="photo-frame">
                  <img :src="capturedPhoto" alt="Ảnh vừa chụp" v-if="capturedPhoto">
                  <div class="photo-placeholder" v-else>Chưa có ảnh</div>
                </div>
                <div class="photo-label">Ảnh vừa chụp</div>
              </div>
            </div>

            <!-- Cột phải: Thông tin -->
            <div class="info-column">
              <div class="info-grid">
                <div class="info-card" v-for="(group, idx) in infoGroups" :key="idx">
                  <div class="info-title">{{ group.title }}</div>
                  <table class="info-table">
                    <tbody>
                      <tr v-for="item in group.items" :key="item.label">
                        <td class="field-name">{{ item.label }}</td>
                        <td class="field-value">{{ item.value }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="action-buttons">
                <button class="action-button primary" @click="showPrintDialog">In thông tin</button>
                <button class="action-button" @click="resetFlow">Thoát</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Dialog in thông tin -->
        <div v-if="showPrint" class="print-dialog-overlay" @click="closePrintDialog">
          <div class="print-dialog" @click.stop>
            <div class="print-dialog-header">
              <h3 class="print-dialog-title">Chọn thông tin cần in</h3>
              <button class="print-dialog-close" @click="closePrintDialog">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="print-dialog-content">
              <div class="print-section">
                <h4 class="print-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  Thông tin cơ bản
                </h4>
                <div class="checkbox-group">
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.id">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Số CCCD</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.name">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Họ và tên</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.dob">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Ngày sinh</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.gender">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Giới tính</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.nationality">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Quốc tịch</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.ethnicity">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Dân tộc</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.religion">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Tôn giáo</span>
                  </label>
                </div>
              </div>
              <div class="print-section">
                <h4 class="print-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  Thông tin địa chỉ
                </h4>
                <div class="checkbox-group">
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.placeOfOrigin">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Quê quán</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.permanentAddress">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Nơi thường trú</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.currentAddress">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Nơi ở hiện tại</span>
                  </label>
                </div>
              </div>
              <div class="print-section">
                <h4 class="print-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  Thông tin gia đình
                </h4>
                <div class="checkbox-group">
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.fatherName">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Họ tên cha</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.motherName">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Họ tên mẹ</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.spouseName">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Họ tên vợ/chồng</span>
                  </label>
                </div>
              </div>
              <div class="print-section">
                <h4 class="print-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
                    <line x1="16" y1="8" x2="2" y2="22"/>
                    <line x1="17.5" y1="15" x2="9" y2="15"/>
                  </svg>
                  Thông tin bổ sung
                </h4>
                <div class="checkbox-group">
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.identifyingMarks">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Đặc điểm nhận dạng</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.bloodType">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Nhóm máu</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.socialInsuranceNumber">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Mã số BHXH</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.healthInsuranceNumber">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Mã số BHYT</span>
                  </label>
                </div>
              </div>
              <div class="print-section">
                <h4 class="print-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Thông tin giấy tờ
                </h4>
                <div class="checkbox-group">
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.documentType">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Loại giấy tờ</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.issueDate">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Ngày cấp</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.issuePlace">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Nơi cấp</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.expiryDate">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Ngày hết hạn</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.mrzCode">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-label">Mã số MRZ</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="print-dialog-footer">
              <button class="print-dialog-button cancel" @click="closePrintDialog">Hủy</button>
              <button class="print-dialog-button print" @click="printSelectedInfo" :disabled="!hasSelectedOptions">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                In thông tin
              </button>
            </div>
          </div>
        </div>

        <!-- Bước 5: Đang xử lý ảnh -->
        <div v-else-if="step === 5" class="cccd-step step-processing">
          <div class="cccd-progress-icon">
            <svg width="64" height="64" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none" stroke="#43e97b" stroke-width="6" stroke-linecap="round" stroke-dasharray="31.4 31.4" stroke-dashoffset="0">
                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
          <div class="cccd-progress-bar modern-bar">
            <div class="cccd-progress-fill" :style="{width: progress + '%'}"></div>
          </div>
          <div class="cccd-progress-label">
            <span class="processing-message">Đang xác thực thông tin</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import cccdImg from '@/assets/icons/cccd.jpg'
import gifKiosk from '@/assets/GIFKiosk1.gif'
import fisLogo from '@/assets/icons/fis-logo.svg'

const router = useRouter()
const step = ref(1)
const progress = ref(0)
const capturedPhoto = ref('')
const cccdData = ref({
  name: 'Nguyễn Văn A',
  dob: '01/01/1990',
  id: '001234567890',
  photo: cccdImg,
  gender: 'Nam',
  nationality: 'Việt Nam',
  ethnicity: 'Kinh',
  religion: 'Không',
  placeOfOrigin: 'Xã An Thạnh, Huyện Bến Lức, Tỉnh Long An',
  permanentAddress: 'Số 123, Đường Nguyễn Văn Linh, Phường 7, Quận 8, TP.HCM',
  currentAddress: 'Số 456, Đường Lê Văn Việt, Phường Hiệp Phú, Quận 9, TP.HCM',
  fatherName: 'Nguyễn Văn B',
  motherName: 'Trần Thị C',
  spouseName: 'Lê Thị D',
  identifyingMarks: 'Không có',
  bloodType: 'A',
  socialInsuranceNumber: '1234567890',
  healthInsuranceNumber: 'HI123456789',
  documentType: 'Căn cước công dân',
  issueDate: '01/01/2020',
  issuePlace: 'Công an TP.HCM',
  expiryDate: '01/01/2035',
  mrzCode: 'IDVN123456789012345678901234'
})

// Camera states
const videoRef = ref(null)
const canvasRef = ref(null)
const isCameraActive = ref(false)
const isCountingDown = ref(false)
const countdown = ref(0)
const cameraStatus = ref('Đang chuẩn bị camera...')
const showPhotoPreview = ref(false)
let stream = null
let progressInterval = null
let autoStartTimer = null

// Dialog in thông tin
const showPrint = ref(false)
const printOptions = ref({
  id: true,
  name: true,
  dob: true,
  gender: true,
  nationality: true,
  ethnicity: true,
  religion: true,
  placeOfOrigin: true,
  permanentAddress: true,
  currentAddress: true,
  fatherName: true,
  motherName: true,
  spouseName: true,
  identifyingMarks: true,
  bloodType: true,
  socialInsuranceNumber: true,
  healthInsuranceNumber: true,
  documentType: true,
  issueDate: true,
  issuePlace: true,
  expiryDate: true,
  mrzCode: true
})
const hasSelectedOptions = computed(() => {
  return Object.values(printOptions.value).some(value => value)
})

// Thêm biến mới cho xử lý ảnh
let photoProcessingInterval = null

// Watch for step changes to auto-start camera
watch(step, (newStep) => {
  if (newStep === 3) {
    // Auto start camera after 500ms
    setTimeout(() => {
      startCamera()
    }, 500)
  }
})

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      } 
    })
    videoRef.value.srcObject = stream
    isCameraActive.value = true
    cameraStatus.value = 'Đang chuẩn bị camera...'
    
    // Auto start countdown after 2 seconds
    setTimeout(() => {
      startCountdown()
    }, 2000)
  } catch (err) {
    console.error('Error accessing camera:', err)
    cameraStatus.value = 'Không thể truy cập camera, vui lòng kiểm tra quyền truy cập'
  }
}

function startCountdown() {
  isCountingDown.value = true
  countdown.value = 5
  cameraStatus.value = 'Chuẩn bị chụp ảnh...'
  
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      capturePhoto()
    }
  }, 1000)
}

function capturePhoto() {
  const video = videoRef.value
  const canvas = canvasRef.value
  const context = canvas.getContext('2d')
  
  // Set canvas size to match video
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  
  // Draw current video frame to canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height)
  
  // Convert canvas to image
  capturedPhoto.value = canvas.toDataURL('image/jpeg')
  isCountingDown.value = false
  cameraStatus.value = 'Đã chụp ảnh thành công'
  
  // Stop camera stream
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    isCameraActive.value = false
  }

  // Hiển thị preview ảnh vừa chụp
  showPhotoPreview.value = true
  
  // Chuyển sang bước xử lý ảnh
  setTimeout(() => {
    showPhotoPreview.value = false
    step.value = 5
    progress.value = 0
    
    // Giả lập quá trình xử lý ảnh
    photoProcessingInterval = setInterval(() => {
      if (progress.value < 100) {
        progress.value += 5
      } else {
        clearInterval(photoProcessingInterval)
        photoProcessingInterval = null
        setTimeout(() => {
          step.value = 4 // Chuyển sang hiển thị kết quả
        }, 400)
      }
    }, 80)
  }, 1000)
}

function startReading() {
  step.value = 2
  progress.value = 0
  progressInterval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 5
    } else {
      clearInterval(progressInterval)
      progressInterval = null
      setTimeout(() => {
        step.value = 3
      }, 400)
    }
  }, 80)
}

function nextStep() {
  step.value = 4
}

function showPrintDialog() {
  showPrint.value = true
}

function closePrintDialog() {
  showPrint.value = false
}

function printSelectedInfo() {
  const selectedInfo = []
  if (printOptions.value.id) selectedInfo.push(`Số CCCD: ${cccdData.value.id}`)
  if (printOptions.value.name) selectedInfo.push(`Họ và tên: ${cccdData.value.name}`)
  if (printOptions.value.dob) selectedInfo.push(`Ngày sinh: ${cccdData.value.dob}`)
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <html><head><title>Thông tin cá nhân</title></head><body>
    <h2>Thông tin cá nhân</h2>
    ${selectedInfo.map(info => `<div>${info}</div>`).join('')}
    </body></html>
  `)
  printWindow.document.close()
  printWindow.print()
  closePrintDialog()
}

function resetFlow() {
  if (step.value === 4) {
    router.replace('/guest-mode')
    return
  }
  step.value = 1
  capturedPhoto.value = ''
  progress.value = 0
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
  isCameraActive.value = false
  isCountingDown.value = false
  countdown.value = 0
  if (autoStartTimer) {
    clearTimeout(autoStartTimer)
  }
}

// Chuẩn bị dữ liệu nhóm thông tin cho giao diện mới
const infoGroups = computed(() => [
  {
    title: 'Thông tin cơ bản',
    items: [
      { label: 'Số CCCD', value: cccdData.value.id || '---' },
      { label: 'Họ và tên', value: cccdData.value.name || '---' },
      { label: 'Ngày sinh', value: cccdData.value.dob || '---' },
      { label: 'Giới tính', value: cccdData.value.gender || '---' },
      { label: 'Quốc tịch', value: cccdData.value.nationality || '---' },
      { label: 'Dân tộc', value: cccdData.value.ethnicity || '---' },
      { label: 'Tôn giáo', value: cccdData.value.religion || '---' },
    ]
  },
  {
    title: 'Thông tin địa chỉ',
    items: [
      { label: 'Quê quán', value: cccdData.value.placeOfOrigin || '---' },
      { label: 'Nơi thường trú', value: cccdData.value.permanentAddress || '---' },
      { label: 'Nơi ở hiện tại', value: cccdData.value.currentAddress || '---' },
    ]
  },
  {
    title: 'Thông tin gia đình',
    items: [
      { label: 'Họ tên cha', value: cccdData.value.fatherName || '---' },
      { label: 'Họ tên mẹ', value: cccdData.value.motherName || '---' },
      { label: 'Họ tên vợ/chồng', value: cccdData.value.spouseName || '---' },
    ]
  },
  {
    title: 'Thông tin bổ sung',
    items: [
      { label: 'Đặc điểm nhận dạng', value: cccdData.value.identifyingMarks || '---' },
      { label: 'Nhóm máu', value: cccdData.value.bloodType || '---' },
      { label: 'Mã số BHXH', value: cccdData.value.socialInsuranceNumber || '---' },
      { label: 'Mã số BHYT', value: cccdData.value.healthInsuranceNumber || '---' },
    ]
  },
  {
    title: 'Thông tin giấy tờ',
    items: [
      { label: 'Loại giấy tờ', value: cccdData.value.documentType || '---' },
      { label: 'Số giấy tờ', value: cccdData.value.id || '---' },
      { label: 'Ngày cấp', value: cccdData.value.issueDate || '---' },
      { label: 'Nơi cấp', value: cccdData.value.issuePlace || '---' },
      { label: 'Ngày hết hạn', value: cccdData.value.expiryDate || '---' },
      { label: 'Mã số MRZ', value: cccdData.value.mrzCode || '---' },
    ]
  },
])

function goToGuestMode() {
  router.push({ name: 'GuestModeView' })
}

onUnmounted(() => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
  if (progressInterval) {
    clearInterval(progressInterval)
  }
  if (photoProcessingInterval) {
    clearInterval(photoProcessingInterval)
  }
  if (autoStartTimer) {
    clearTimeout(autoStartTimer)
  }
})
</script>

<style scoped>
.cccd-flow-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #e0e7ef 0%, #f8fafc 100%), url('https://www.transparenttextures.com/patterns/cubes.png');
  background-blend-mode: lighten;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-center-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  min-height: 80vh;
  gap: 1.5rem;
}

.camera-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  background: none;
  margin: 0;
  padding: 0;
}

.cccd-camera-frame.modern-camera-frame {
  width: 600px;
  max-width: 98vw;
  aspect-ratio: 4/3;
  position: relative;
  background: linear-gradient(135deg, #232526 0%, #414345 100%);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(33,150,243,0.18), 0 2px 12px rgba(255,152,0,0.09);
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-side-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  max-width: 420px;
  width: 100%;
  gap: 1rem;
  background: rgba(255,255,255,0.85);
  border-radius: 18px;
  box-shadow: 0 2px 16px #1976d222;
  padding: 1.2rem 0.7rem;
  margin: 1.2rem 0 0 0;
  backdrop-filter: blur(6px);
  font-size: 1.3rem;
}

@media (max-width: 600px) {
  .cccd-camera-frame.modern-camera-frame {
    width: 98vw;
    border-radius: 10px;
  }
  .camera-side-panel {
    border-radius: 10px;
    padding: 0.7rem 0.3rem;
    margin: 0.7rem 0 0 0;
  }
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(.4,0,.2,1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.98);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-40px) scale(0.98);
}
.cccd-flow-container {
  min-width: 340px;
  max-width: 98vw;
  background: rgba(255,255,255,0.92);
  border-radius: 32px;
  box-shadow: 0 12px 48px rgba(33,150,243,0.13), 0 2px 12px rgba(255,152,0,0.09);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  backdrop-filter: blur(8px);
}
.gradient-title {
  background: linear-gradient(90deg, #1976d2 0%, #43e97b 50%, #ff9800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-weight: 900;
  letter-spacing: 2px;
  font-size: 2.1rem;
  text-align: center;
  text-shadow: 0 4px 24px #43e97b33, 0 1px 2px #0002;
  filter: drop-shadow(0 2px 8px #1976d244);
  border-radius: 12px;
  padding: 0.2em 0.5em;
}
.pulse {
  animation: pulseText 1.2s infinite alternate;
}
@keyframes pulseText {
  0% { opacity: 1; }
  100% { opacity: 0.6; }
}
.cccd-step {
  background: rgba(255,255,255,0.98);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(33,150,243,0.10);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 340px;
  max-width: 98vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}
.cccd-title {
  font-size: 2rem;
  font-weight: 900;
  color: #1976d2;
  text-align: center;
  margin-bottom: 1.5rem;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 12px #1976d233;
}
.btn-icon {
  display: inline-flex;
  align-items: center;
  margin-right: 0.5em;
  vertical-align: middle;
}
.cccd-btn {
  padding: 0.8em 2.2em;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 14px;
  border: none;
  background: #e3f2fd;
  color: #1976d2;
  cursor: pointer;
  margin: 0 0.5em;
  box-shadow: 0 2px 8px #1976d211;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.18s;
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
}
.cccd-btn.primary {
  background: linear-gradient(90deg, #1976d2 0%, #43e97b 100%);
  color: #fff;
  box-shadow: 0 4px 16px #43e97b22;
}
.cccd-btn:hover {
  background: #bbdefb;
  color: #1976d2;
  transform: translateY(-2px) scale(1.04);
}
.cccd-btn.primary:hover {
  background: linear-gradient(90deg, #43e97b 0%, #1976d2 100%);
  color: #fff;
}
.cccd-icon-guide {
  margin-bottom: 1.5rem;
}
.cccd-progress-icon {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 1rem;
}
.cccd-progress-icon svg {
  width: 100%;
  height: 100%;
  animation: rotate 2s linear infinite;
}
.cccd-progress-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: rgba(67, 233, 123, 0.1);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}
.cccd-progress-bar.modern-bar {
  width: 400px;
  height: 10px;
  background: #e3f2fd;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
}
.cccd-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1976d2, #43e97b);
  border-radius: 6px;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}
.cccd-progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.5s infinite;
}
.cccd-progress-label {
  font-size: 1.2rem;
  color: #1976d2;
  font-weight: 600;
  text-align: center;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.processing-message {
  font-size: 1.2rem;
  color: #1976d2;
  font-weight: 600;
}
.processing-submessage {
  font-size: 1rem;
  color: #666;
  font-weight: normal;
}
.cccd-progress-label::before {
  content: 'Vui lòng đợi trong giây lát...';
  font-size: 1.1rem;
  color: #666;
  font-weight: normal;
}
.cccd-progress-label::after {
  content: 'Đang đọc thông tin từ thẻ căn cước';
  font-size: 0.95rem;
  color: #888;
  font-weight: normal;
}
.camera-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(1.08) contrast(1.08) saturate(1.1);
}
.face-guide-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  pointer-events: none;
}
.face-guide-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2.5px solid #43e97b;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  box-shadow: 0 0 32px 8px #43e97b44, 0 0 0 9999px rgba(0,0,0,0.45);
  transition: box-shadow 0.3s;
}
.face-guide-corners {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.corner {
  position: absolute;
  width: 18px;
  height: 18px;
  border-color: #43e97b;
  border-style: solid;
  border-width: 0;
}
.top-left {
  top: -2px;
  left: -2px;
  border-top-width: 2.5px;
  border-left-width: 2.5px;
  border-top-left-radius: 8px;
}
.top-right {
  top: -2px;
  right: -2px;
  border-top-width: 2.5px;
  border-right-width: 2.5px;
  border-top-right-radius: 8px;
}
.bottom-left {
  bottom: -2px;
  left: -2px;
  border-bottom-width: 2.5px;
  border-left-width: 2.5px;
  border-bottom-left-radius: 8px;
}
.bottom-right {
  bottom: -2px;
  right: -2px;
  border-bottom-width: 2.5px;
  border-right-width: 2.5px;
  border-bottom-right-radius: 8px;
}
.camera-instructions {
  text-align: left;
  color: #1976d2;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.instruction-text.small {
  font-size: 0.95rem;
  color: #666;
  font-weight: normal;
}
.camera-status {
  color: #1976d2;
  font-size: 1.05rem;
  font-weight: 600;
  margin-top: 0.5rem;
  text-align: left;
}
.cccd-result-content {
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  align-items: flex-start;
  margin-bottom: 2rem;
}
.cccd-result-photos {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.result-photo-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.result-photo.modern-photo {
  width: 110px;
  height: 140px;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 2px 12px #1976d233, 0 0 0 4px #43e97b22;
  border: 2.5px solid #e3f2fd;
}
.photo-label {
  font-size: 0.95rem;
  color: #1976d2;
  font-weight: 600;
  text-align: center;
}
.cccd-result-info {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  font-size: 1.15rem;
  color: #222;
  font-weight: 600;
  min-width: 220px;
}
.info-row {
  display: flex;
  gap: 0.7rem;
  align-items: center;
}
.info-label {
  color: #1976d2;
  min-width: 90px;
}
.cccd-result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(33,150,243,0.08);
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.countdown-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
}
.countdown-content {
  text-align: center;
  color: white;
  filter: drop-shadow(0 2px 8px #43e97b88);
}
.countdown-message {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px #1976d244;
}
.countdown-number {
  font-size: 7rem;
  font-weight: 900;
  line-height: 1;
  color: #43e97b;
  text-shadow: 0 0 32px #43e97b88, 0 2px 8px #1976d244;
  animation: pulse 1s infinite;
}
.countdown-unit {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 0.25rem;
  text-shadow: 0 2px 8px #1976d244;
}
.photo-preview-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 20;
  border-radius: inherit;
  box-shadow: 0 0 0 4px #43e97b55;
  animation: fadeInPhoto 0.3s;
}
@keyframes fadeInPhoto {
  from { opacity: 0; }
  to { opacity: 1; }
}
.info-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.id-photo {
  display: flex;
  flex-direction: row;
  gap: 2rem;
}
.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.photo-wrapper {
  width: 110px;
  height: 140px;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
}
.photo-wrapper.id-photo-wrapper {
  border: 2.5px solid #43e97b;
}
.photo-wrapper.current-photo-wrapper {
  border: 2.5px solid #ff9800;
}
.photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: inherit;
}
.photo-placeholder span {
  font-size: 1.2rem;
  font-weight: 600;
  color: #666;
}
.photo-label {
  font-size: 0.95rem;
  color: #1976d2;
  font-weight: 600;
  text-align: center;
}
.action-button {
  padding: 0.8em 2em;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 160px;
  justify-content: center;
}
.action-button.primary {
  background: linear-gradient(135deg, #1976d2 0%, #43e97b 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(33,150,243,0.2);
}
.action-button:not(.primary) {
  background: #fff;
  color: #666;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
.action-button:hover {
  transform: translateY(-2px);
}
.action-button.primary:hover {
  background: linear-gradient(135deg, #43e97b 0%, #1976d2 100%);
  box-shadow: 0 6px 16px rgba(33,150,243,0.25);
}
.action-button:not(.primary):hover {
  background: #f8fafc;
  border-color: #1976d2;
  color: #1976d2;
}
.info-table {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.info-groups {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.group-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: #1976d2;
  text-align: center;
  margin-bottom: 0.5rem;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 12px #1976d233;
}
.field-name {
  width: 180px;
  color: #666;
  font-weight: 500;
  padding-right: 1rem;
}
.field-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  text-align: left;
}
.result-flexbox {
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}
.result-photo-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  min-width: 420px;
  max-width: 520px;
  width: 100%;
  padding: 1rem;
}
.result-final-photo-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
}
.result-final-photo {
  width: 300px;
  height: 400px;  /* Tỷ lệ 3x4 */
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 2px 12px #1976d233, 0 0 0 4px #43e97b22;
  border: 2.5px solid #e3f2fd;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.result-final-photo.current-photo {
  border: 2.5px solid #ff9800;
  width: 300px;
  height: 300px;  /* Tỷ lệ vuông */
}
.result-final-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}
.photo-label {
  font-size: 1.1rem;
  color: #1976d2;
  font-weight: 600;
  text-align: center;
  padding: 0.3rem 0.8rem;
  background: #f8fafc;
  border-radius: 8px;
  box-shadow: 0 1px 4px #1976d211;
}
.result-final-info-col {
  flex: 1;
  min-width: 0;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: stretch;
}
.result-final-info-groups {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
}
.result-final-info-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px #1976d21a, 0 1px 4px #43e97b22;
  padding: 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.result-final-info-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 0.3rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid #e3f2fd;
}
.result-final-info-table {
  width: 100%;
  border-collapse: collapse;
}
.result-final-info-table td {
  padding: 0.5rem 0.4rem;
  border-bottom: 1px solid #f0f0f0;
  font-size: 1rem;
  line-height: 1.4;
}
.result-final-info-table tr:last-child td {
  border-bottom: none;
}
.field-name {
  width: 180px;
  color: #666;
  font-weight: 500;
  padding-right: 1rem;
}
.field-value {
  color: #222;
  font-weight: 500;
}
.result-final-actions {
  display: flex;
  gap: 1.2rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}
@media (max-width: 1200px) {
  .result-final-container {
    max-width: 95vw;
    padding: 1.5rem;
  }
  
  .result-final-row {
    gap: 2rem;
  }
  
  .result-final-info-groups {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 900px) {
  .result-final-container {
    padding: 1rem;
  }
  
  .result-final-row {
    flex-direction: column;
    gap: 1.5rem;
    padding: 0;
  }
  
  .result-final-photo-col,
  .result-final-info-col {
    max-width: 100%;
  }
  
  .result-final-info-card {
    padding: 1rem;
  }
  
  .result-final-info-title {
    font-size: 1.1rem;
  }
  
  .result-final-info-table td {
    font-size: 0.95rem;
    padding: 0.4rem 0.3rem;
  }
  
  .field-name {
    width: 150px;
  }
}
@media (max-width: 600px) {
  .result-final-container {
    padding: 0.8rem;
  }
  
  .result-final-row {
    gap: 1rem;
  }
  
  .result-final-info-card {
    padding: 0.8rem;
    border-radius: 12px;
  }
  
  .result-final-info-title {
    font-size: 1rem;
  }
  
  .result-final-info-table td {
    font-size: 0.9rem;
  }
  
  .field-name {
    width: 120px;
  }
}
.print-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.print-dialog {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
  overflow: hidden;
}

.print-dialog-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #f8fafc 0%, #fff 100%);
}

.print-dialog-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1976d2;
  margin: 0;
}

.print-dialog-close {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.print-dialog-close:hover {
  background: #f0f0f0;
  color: #1976d2;
}

.print-dialog-content {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.print-section {
  margin-bottom: 2rem;
}

.print-section:last-child {
  margin-bottom: 0;
}

.print-section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: #1976d2;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e3f2fd;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s;
}

.checkbox-item:hover {
  background: #f8fafc;
}

.checkbox-item input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #1976d2;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  position: relative;
}

.checkbox-item input[type="checkbox"]:checked + .checkbox-custom {
  background: #1976d2;
  border-color: #1976d2;
}

.checkbox-item input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label {
  font-size: 1rem;
  color: #333;
}

.print-dialog-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background: #f8fafc;
}

.print-dialog-button {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.print-dialog-button.cancel {
  background: #f0f0f0;
  color: #666;
  border: none;
}

.print-dialog-button.cancel:hover {
  background: #e0e0e0;
}

.print-dialog-button.print {
  background: linear-gradient(135deg, #1976d2 0%, #43e97b 100%);
  color: white;
  border: none;
}

.print-dialog-button.print:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.print-dialog-button.print:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .print-dialog {
    width: 95%;
    max-height: 95vh;
  }
  
  .checkbox-group {
    grid-template-columns: 1fr;
  }
  
  .print-dialog-header {
    padding: 1rem;
  }
  
  .print-dialog-content {
    padding: 1rem;
  }
  
  .print-dialog-footer {
    padding: 1rem;
  }
  
  .print-dialog-button {
    padding: 0.7rem 1.2rem;
  }
}

.result-container {
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  gap: 3rem;
  align-items: flex-start;
}

.photo-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0;
  max-width: 420px;
  width: 100%;
}

.photo-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.photo-frame {
  width: 300px;
  height: 400px;
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 2px 12px #1976d233, 0 0 0 4px #43e97b22;
  border: 2.5px solid #e3f2fd;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.photo-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-label {
  font-size: 1.1rem;
  color: #1976d2;
  font-weight: 600;
  text-align: center;
  padding: 0.3rem 0.8rem;
  background: #f8fafc;
  border-radius: 8px;
  box-shadow: 0 1px 4px #1976d211;
}

.info-column {
  flex: 1;
  min-width: 0;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
}

.info-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px #1976d21a, 0 1px 4px #43e97b22;
  padding: 1.2rem 1.5rem;
}

.info-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 0.3rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid #e3f2fd;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table td {
  padding: 0.5rem 0.4rem;
  border-bottom: 1px solid #f0f0f0;
  font-size: 1rem;
  line-height: 1.4;
}

.info-table tr:last-child td {
  border-bottom: none;
}

.field-name {
  width: 180px;
  color: #666;
  font-weight: 500;
  padding-right: 1rem;
}

.field-value {
  color: #222;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 1.2rem;
  justify-content: flex-end;
}

@media (max-width: 1200px) {
  .result-container {
    max-width: 95vw;
    padding: 1.5rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .result-container {
    flex-direction: column;
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .photo-column,
  .info-column {
    max-width: 100%;
  }
  
  .info-card {
    padding: 1rem;
  }
  
  .info-title {
    font-size: 1.1rem;
  }
  
  .info-table td {
    font-size: 0.95rem;
    padding: 0.4rem 0.3rem;
  }
  
  .field-name {
    width: 150px;
  }
}

@media (max-width: 600px) {
  .result-container {
    padding: 0.8rem;
  }
  
  .info-card {
    padding: 0.8rem;
    border-radius: 12px;
  }
  
  .info-title {
    font-size: 1rem;
  }
  
  .info-table td {
    font-size: 0.9rem;
  }
  
  .field-name {
    width: 120px;
  }
}

.cccd-step.step-guide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
}

.fis-logo-guide {
  width: 120px;
  height: auto;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.fis-logo-guide:hover {
  transform: scale(1.05);
}

.cccd-title.gradient-title {
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  padding: 0 1rem;
  text-align: center;
  line-height: 1.4;
}

.gif-guide-wrapper {
  width: 100%;
  max-width: 480px;
  margin: 0.5rem 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(33,150,243,0.15);
}

.cccd-guide-gif {
  width: 100%;
  height: auto;
  display: block;
}

.cccd-btn.primary {
  margin-top: 0.5rem;
  padding: 0.7em 1.8em;
  font-size: 1.05rem;
}

@media (max-width: 768px) {
  .cccd-step.step-guide {
    padding: 1.5rem;
  }

  .fis-logo-guide {
    width: 100px;
  }

  .cccd-title.gradient-title {
    font-size: 1.5rem;
    padding: 0 0.5rem;
  }

  .gif-guide-wrapper {
    max-width: 100%;
  }

  .cccd-btn.primary {
    padding: 0.6em 1.5em;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .cccd-step.step-guide {
    padding: 1rem;
  }

  .fis-logo-guide {
    width: 80px;
  }

  .cccd-title.gradient-title {
    font-size: 1.3rem;
  }
}
</style> 