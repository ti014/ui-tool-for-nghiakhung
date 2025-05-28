<template>
  <div class="auth-method-container">
    <div class="auth-header">
      <img src="@/assets/icons/fis-logo.svg" alt="FPT IS" class="auth-logo" />
      <h1 class="auth-title">Chọn phương thức xác thực</h1>
      <p class="auth-subtitle">Vui lòng vuốt màn hình sang trái hoặc sang phải để chọn phương thức xác thực bạn mong muốn</p>
    </div>
    <div class="auth-swiper-nav">
      <Swiper
        :slides-per-view="2"
        :space-between="40"
        :centered-slides="true"
        :loop="true"
        :breakpoints="{600: {slidesPerView: 2, spaceBetween: 40}, 900: {slidesPerView: 2, spaceBetween: 56}}"
        class="auth-swiper"
        @swiper="onSwiper"
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { useRouter } from 'vue-router';
const router = useRouter();
const swiperRef = ref();
function onSwiper(swiper) {
  swiperRef.value = swiper;
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
];
function handleSelect(key) {
  if (key === 'cccd') {
    router.push({ name: 'ReadCccdFlowView' })
    return
  }
  if (key === 'passport') {
    router.push({ name: 'ReadPassportFlowView' })
    return
  }
  if (key === 'guide') {
    alert('Hướng dẫn sử dụng: Vui lòng chọn tính năng phù hợp để xác thực hoặc xem hướng dẫn chi tiết.');
    return;
  }
  alert('Bạn đã chọn: ' + features.find(f => f.key === key).title);
  // router.push({ name: ... })
}
function goPrev() {
  if (swiperRef.value) {
    swiperRef.value.slidePrev();
  }
}
function goNext() {
  if (swiperRef.value) {
    swiperRef.value.slideNext();
  }
}
// Hiệu ứng pulse khi click card
function pulse(e) {
  const el = e.currentTarget;
  el.classList.remove('pulse-anim');
  void el.offsetWidth;
  el.classList.add('pulse-anim');
}
</script>

<style scoped>
.auth-method-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ef 0%, #f8fafc 100%), url('https://www.transparenttextures.com/patterns/cubes.png');
  background-blend-mode: lighten;
  padding: 3.5rem 4rem;
  font-family: Arial, Tahoma, Verdana, 'Segoe UI', sans-serif;
}

.auth-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 2.5rem;
}
.auth-logo {
  width: 110px;
  margin-bottom: 1.2rem;
}
.auth-title {
  font-size: 2.1rem;
  font-weight: 700;
  color: #4285f4;
  margin-bottom: 0.5rem;
  text-align: center;
}
.auth-subtitle {
  font-size: 1.08rem;
  color: #888;
  text-align: center;
  margin-bottom: 0.2rem;
}

.auth-swiper-nav,
.auth-swiper,
.swiper,
.swiper-wrapper {
  overflow: visible !important;
}

.auth-swiper-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.2rem;
  width: 100%;
  max-width: 1200px;
  margin-top: 1.5rem;
  padding-top: 2.5rem;
}

.auth-swiper {
  width: 100%;
  max-width: 1100px;
  padding-bottom: 2.5rem;
}

.nav-btn {
  background: linear-gradient(135deg, #e3f2fd 60%, #fffde4 100%);
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 18px rgba(33,150,243,0.13);
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  position: relative;
  z-index: 2;
}

.nav-btn:hover {
  background: linear-gradient(135deg, #bbdefb 60%, #ffe082 100%);
  box-shadow: 0 8px 32px rgba(33,150,243,0.18), 0 0 16px 4px #43e97b44;
  transform: scale(1.08) rotate(-6deg);
}

/* Card hiện đại */
.modern-card {
  width: 360px;
  height: 240px;
  background: rgba(255,255,255,0.85);
  border: 1.5px solid #e3e3e3;
  border-radius: 28px;
  box-shadow: 0 8px 32px 0 rgba(33,150,243,0.10), 0 2px 12px rgba(255,152,0,0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2.2rem 1.2rem 1.2rem 1.2rem;
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
  margin-bottom: 1.2rem;
}

.auth-img, .auth-icon-placeholder {
  width: 72px;
  height: 72px;
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
  font-size: 1.32rem;
  font-weight: 900;
  color: #222;
  text-align: center;
  letter-spacing: 0.7px;
  margin-bottom: 0.7rem;
  font-family: inherit;
}

.auth-desc {
  font-size: 1.08rem;
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
  .modern-card {
    width: 98vw;
    max-width: 98vw;
    height: 140px;
    padding: 0.7rem 0.7rem 0.7rem 0.7rem;
    flex-direction: row;
    border-radius: 10px;
  }
  .auth-img, .auth-icon-placeholder {
    width: 40px;
    height: 40px;
    margin-bottom: 0;
    margin-right: 0.5rem;
    border-radius: 6px;
  }
  .card-vertical-icon {
    margin-bottom: 0;
  }
  .auth-label {
    font-size: 1.1rem;
    margin-bottom: 0.3rem;
  }
  .auth-desc {
    font-size: 0.9rem;
  }
}

@media (max-width: 600px) {
  .auth-title-bar {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.7rem 1rem;
  }
  .modern-gradient-title {
    font-size: 1.2rem;
    text-align: center;
  }
  .auth-swiper-nav {
    gap: 0.3rem;
    padding-top: 1rem;
  }
  .nav-btn {
    width: 32px;
    height: 32px;
  }
  .modern-card {
    width: 98vw;
    max-width: 98vw;
    height: 90px;
    padding: 0.2rem 0.2rem 0.2rem 0.2rem;
    flex-direction: row;
    border-radius: 6px;
  }
  .auth-img, .auth-icon-placeholder {
    width: 24px;
    height: 24px;
    margin-bottom: 0;
    margin-right: 0.3rem;
    border-radius: 4px;
  }
}
</style> 