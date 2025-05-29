<template>
  <div class="auth-method-container">
    <div class="auth-header">
      <img src="@/assets/icons/fis-logo.svg" alt="FPT IS" class="auth-logo" @click="goToGuestMode" />
      <h1 class="auth-title">Chọn phương thức xác thực</h1>
      <p class="auth-subtitle">Vui lòng vuốt màn hình sang trái hoặc sang phải để chọn phương thức xác thực bạn mong muốn</p>
    </div>

    <div class="swiper-container">
      <button class="nav-button prev" @click="slidePrev" :disabled="currentIndex === 0">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      <Swiper
        :slides-per-view="2"
        :space-between="40"
        :centered-slides="true"
        :loop="true"
        :breakpoints="{600: {slidesPerView: 2, spaceBetween: 40}, 900: {slidesPerView: 2, spaceBetween: 56}}"
        class="auth-swiper"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
        <SwiperSlide v-for="item in features" :key="item.key">
          <button class="auth-card modern-card" @click="handleSelect(item.key)" @mousedown="pulse($event)">
            <div class="card-vertical-icon">
              <img v-if="item.img" :src="item.img" :alt="item.title" class="auth-img" />
              <div v-else class="auth-icon-placeholder">
                <svg v-if="item.key==='qr'" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#2196F3" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><path d="M7 17v.01M7 14v.01M3 14v.01M3 17v.01M10 17v.01M10 14v.01"/></svg>
                <svg v-if="item.key==='guide'" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#FF9800" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M20 17V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
              </div>
            </div>
            <span class="auth-label">{{ item.title }}</span>
            <span class="auth-desc tooltip-parent">{{ item.desc }}
              <span class="card-tooltip">{{ item.desc }}</span>
            </span>
          </button>
        </SwiperSlide>
      </Swiper>

      <button class="nav-button next" @click="slideNext" :disabled="currentIndex >= features.length - 1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const router = useRouter()
const swiperInstance = ref(null)
const currentIndex = ref(0)
let inactivityTimer = null

// Function to go to guest mode
function goToGuestMode() {
  router.replace('/guest-mode')
}

// Function to reset inactivity timer
function resetInactivityTimer() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
  }
  inactivityTimer = setTimeout(() => {
    goToGuestMode()
  }, 60000) // 1 minute = 60000ms
}

// Add event listeners for user activity
function setupInactivityTimer() {
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
  events.forEach(event => {
    document.addEventListener(event, resetInactivityTimer)
  })
  resetInactivityTimer() // Start the timer
}

// Clean up event listeners
function cleanupInactivityTimer() {
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
  events.forEach(event => {
    document.removeEventListener(event, resetInactivityTimer)
  })
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
  }
}

onMounted(() => {
  setupInactivityTimer()
})

onUnmounted(() => {
  cleanupInactivityTimer()
})

const onSwiper = (swiper) => {
  swiperInstance.value = swiper
}

const onSlideChange = (swiper) => {
  currentIndex.value = swiper.activeIndex
}

const slidePrev = () => {
  if (swiperInstance.value && currentIndex.value > 0) {
    swiperInstance.value.slidePrev()
  }
}

const slideNext = () => {
  if (swiperInstance.value && currentIndex.value < features.length - 1) {
    swiperInstance.value.slideNext()
  }
}

const features = [
  {
    key: 'cccd',
    title: 'Căn cước công dân',
    desc: 'Xác thực bằng CCCD Việt Nam',
    img: new URL('@/assets/icons/cccd.jpg', import.meta.url).href,
  },
  {
    key: 'passport',
    title: 'Passport',
    desc: 'Xác thực bằng hộ chiếu',
    img: new URL('@/assets/icons/passport.png', import.meta.url).href,
  },
  {
    key: 'qr',
    title: 'Đọc QR',
    desc: 'Quét mã QR để xác thực',
    img: '',
  },
  {
    key: 'guide',
    title: 'Hướng dẫn sử dụng',
    desc: 'Xem hướng dẫn chi tiết',
    img: '',
  },
]

function handleSelect(key) {
  if (key === 'cccd') {
    router.push({ name: 'ReadCccdFlowView', path: '/guest-mode/read-cccd' })
    return
  }
  if (key === 'passport') {
    router.push({ name: 'ReadPassportFlowView', path: '/guest-mode/read-passport' })
    return
  }
  if (key === 'guide') {
    router.push({ name: 'GuideView', path: '/guest-mode/guide' })
    return
  }
  if (key === 'qr') {
    router.push({ name: 'ReadQrFlowView', path: '/guest-mode/qr' })
    return
  }
  alert('Bạn đã chọn: ' + features.find(f => f.key === key).title)
}

// Hiệu ứng pulse khi click card
function pulse(e) {
  const el = e.currentTarget
  el.classList.remove('pulse-anim')
  void el.offsetWidth
  el.classList.add('pulse-anim')
}
</script>

<style scoped>
.auth-method-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ef 0%, #f8fafc 100%);
  padding: 3.5rem 4rem;
  font-family: Arial, Tahoma, Verdana, 'Segoe UI', sans-serif;
}

.auth-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 2.5rem;
  width: 100%;
  text-align: center;
}

.auth-logo {
  width: 110px;
  margin-bottom: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 
    inset 0 0 0 1px rgba(33, 150, 243, 0.15),
    0 2px 12px rgba(33, 150, 243, 0.1);
  position: relative;
}

.auth-logo::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  right: 4px;
  bottom: 4px;
  border-radius: 12px;
  border: 1px solid rgba(33, 150, 243, 0.2);
  pointer-events: none;
}

.auth-logo:hover {
  transform: scale(1.05);
  box-shadow: 
    inset 0 0 0 1px rgba(33, 150, 243, 0.25),
    0 4px 20px rgba(33, 150, 243, 0.15);
  background: rgba(255, 255, 255, 1);
}

.auth-logo:hover::before {
  border-color: rgba(33, 150, 243, 0.4);
}

.auth-logo:active {
  transform: scale(0.98);
  box-shadow: 
    inset 0 0 0 1px rgba(33, 150, 243, 0.2),
    0 2px 8px rgba(33, 150, 243, 0.1);
}

.auth-title {
  font-size: 2.5rem;
  font-weight: 750;
  color: #4285f4;
  margin-bottom: 0.rem;
  text-align: center;
}

.auth-subtitle {
  font-size: 1.08rem;
  color: #888;
  text-align: center;
  margin-bottom: 0.2rem;
  max-width: 800px;
}

.swiper-container {
  position: relative;
  width: 100%;
  max-width: 1400px;
  margin: 2rem auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-swiper {
  width: 100%;
  padding: 20px 0;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
}

.nav-button:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #1976d2;
  color: #1976d2;
  box-shadow: 0 4px 12px rgba(25,118,210,0.2);
  transform: translateY(-50%) scale(1.1);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-button.prev {
  left: -24px;
}

.nav-button.next {
  right: -24px;
}

/* Card hiện đại */
.modern-card {
  width: 420px;
  height: 280px;
  background: rgba(255, 255, 255, 0.95);
  border: 1.5px solid rgba(227, 227, 227, 0.8);
  border-radius: 28px;
  box-shadow: 0 8px 32px 0 rgba(33, 150, 243, 0.10), 0 2px 12px rgba(255, 152, 0, 0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2.5rem 1.5rem 1.5rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;
  font-family: inherit;
  position: relative;
  backdrop-filter: blur(6px);
  overflow: visible;
}

.card-vertical-icon {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.auth-img, .auth-icon-placeholder {
  width: 84px;
  height: 84px;
  margin-bottom: 0;
  border-radius: 16px;
  background: #f3f4f6cc;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 16px rgba(33,150,243,0.09);
  object-fit: contain;
  transition: all 0.3s ease;
}

.modern-card:hover {
  transform: translateY(-10px) scale(1.04);
  box-shadow: 0 16px 48px 0 rgba(33,150,243,0.16), 0 4px 18px rgba(255,152,0,0.10);
  background: rgba(255,255,255,0.97);
}

.modern-card:hover .auth-img, .modern-card:hover .auth-icon-placeholder {
  box-shadow: 0 8px 32px #43e97b33;
  background: #e3f2fdcc;
  transform: scale(1.08);
}

.auth-label {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1d1c6d;
  text-align: center;
  letter-spacing: 1 px;
  margin-bottom: 0.8rem;
  font-family: inherit;
}

.auth-desc {
  font-size: 1.2rem;
  color: #555;
  text-align: center;
  font-weight: 500;
  font-family: inherit;
}

/* Pulse hiệu ứng khi click */
.pulse-anim {
  animation: pulse 0.5s cubic-bezier(0.4,0,0.2,1);
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 #43e97b55; }
  70% { box-shadow: 0 0 0 24px #43e97b00; }
  100% { box-shadow: 0 0 0 0 #43e97b00; }
}

/* Tooltip mô tả */
.tooltip-parent {
  position: relative;
  display: inline-block;
}

.card-tooltip {
  visibility: hidden;
  opacity: 0;
  width: max-content;
  max-width: 220px;
  background: #222d;
  color: #fff;
  text-align: center;
  border-radius: 8px;
  padding: 0.5em 1em;
  position: absolute;
  z-index: 10;
  left: 50%;
  bottom: 120%;
  transform: translateX(-50%);
  transition: opacity 0.22s;
  font-size: 0.98em;
  pointer-events: none;
  box-shadow: 0 2px 12px #2224;
}

.tooltip-parent:hover .card-tooltip {
  visibility: visible;
  opacity: 1;
}

@media (max-width: 1100px) {
  .swiper-container {
    max-width: 1200px;
    margin-top: 1.5rem;
  }

  .modern-card {
    width: 360px;
    height: 240px;
    padding: 2rem 1.2rem 1.2rem 1.2rem;
  }

  .auth-img, .auth-icon-placeholder {
    width: 72px;
    height: 72px;
  }

  .auth-label {
    font-size: 1.3rem;
  }

  .auth-desc {
    font-size: 1.1rem;
  }
}

@media (max-width: 600px) {
  .swiper-container {
    max-width: 100%;
    margin-top: 1rem;
  }

  .modern-card {
    width: 300px;
    height: 200px;
    padding: 1.5rem 1rem 1rem 1rem;
  }

  .auth-img, .auth-icon-placeholder {
    width: 60px;
    height: 60px;
  }

  .auth-label {
    font-size: 1.2rem;
  }

  .auth-desc {
    font-size: 1rem;
  }
}
</style> 