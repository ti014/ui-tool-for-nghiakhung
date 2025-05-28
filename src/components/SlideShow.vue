<template>
  <div class="slideshow-container">
    <div class="slides" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
      <div v-for="(slide, index) in slides" :key="index" class="slide">
        <img :src="slide.image" :alt="slide.title">
        <div class="slide-overlay"></div>
        <div class="slide-content">
          <div class="brand-logo">
            <img src="@/assets/icons/fis-logo.svg" alt="FPT IS" class="logo">
          </div>
          <h2 class="slide-title">{{ slide.title }}</h2>
          <p class="slide-description">{{ slide.description }}</p>
          <div class="slide-features" v-if="slide.features">
            <div v-for="(feature, idx) in slide.features" :key="idx" class="feature-item">
              <span class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span class="feature-text">{{ feature }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="slide-indicators">
      <span 
        v-for="(_, index) in slides" 
        :key="index"
        :class="['indicator', { active: currentSlide === index }]"
        @click="currentSlide = index"
      ></span>
    </div>
    <div class="slide-controls">
      <button class="control-btn prev" @click="prevSlide">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button class="control-btn next" @click="nextSlide">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const slides = [
  {
    image: new URL('@/assets/slides/1.webp', import.meta.url).href,
    title: 'Kiosk Thông Minh FPT IS',
    description: 'Giải pháp xác thực và xử lý thông tin tự động',
    features: [
      'Đọc và xác thực CCCD gắn chip',
      'Xác thực hộ chiếu điện tử',
      'Tích hợp công nghệ AI tiên tiến',
      'Bảo mật thông tin tuyệt đối'
    ]
  },
  {
    image: new URL('@/assets/slides/2.jpg', import.meta.url).href,
    title: 'Xác Thực Nhanh Chóng',
    description: 'Quy trình xác thực đơn giản, chính xác và an toàn',
    features: [
      'Xác thực danh tính trong 3 giây',
      'Hỗ trợ đa dạng loại giấy tờ',
      'Tích hợp với hệ thống quốc gia',
      'Báo cáo thống kê tự động'
    ]
  },
  {
    image: new URL('@/assets/slides/3.jpg', import.meta.url).href,
    title: 'Giải Pháp Toàn Diện',
    description: 'Tích hợp đa dạng tính năng phục vụ doanh nghiệp',
    features: [
      'Quản lý thông tin tập trung',
      'Tích hợp API dễ dàng',
      'Hỗ trợ 24/7',
      'Cập nhật thường xuyên'
    ]
  }
]

const currentSlide = ref(0)
let slideInterval

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

const startSlideshow = () => {
  slideInterval = setInterval(nextSlide, 8000)
}

onMounted(() => {
  startSlideshow()
})

onUnmounted(() => {
  clearInterval(slideInterval)
})
</script>

<style scoped>
.slideshow-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.slides {
  display: flex;
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
}

.slide {
  min-width: 100%;
  height: 100%;
  position: relative;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.1);
  transition: transform 8s ease;
}

.slide.active img {
  transform: scale(1);
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.85));
}

.slide-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  width: 90%;
  max-width: 1200px;
  z-index: 2;
}

.brand-logo {
  margin-bottom: 2rem;
  padding: 0.8rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  display: inline-block;
  transition: all 0.3s ease;
}

.brand-logo:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.brand-logo .logo {
  height: 35px;
  width: auto;
  filter: none;
  opacity: 1;
  transition: all 0.3s ease;
}

.brand-logo:hover .logo {
  transform: scale(1.05);
}

.slide-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  background: linear-gradient(to right, #fff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.slide-description {
  font-size: 1.75rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  line-height: 1.6;
  font-weight: 300;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.slide-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  font-size: 1.2rem;
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem 2rem;
  border-radius: 16px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.feature-icon {
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon svg {
  width: 24px;
  height: 24px;
  stroke-width: 2.5;
}

.feature-text {
  font-weight: 500;
}

.slide-indicators {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  z-index: 2;
}

.indicator {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.2);
}

.indicator.active {
  background: white;
  transform: scale(1.2);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.slide-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  z-index: 2;
}

.control-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.control-btn svg {
  width: 30px;
  height: 30px;
  stroke-width: 2.5;
}

@media (max-width: 1200px) {
  .slide-title {
    font-size: 3.5rem;
  }

  .slide-description {
    font-size: 1.5rem;
  }

  .feature-item {
    font-size: 1.1rem;
    padding: 1.25rem 1.75rem;
  }
}

@media (max-width: 768px) {
  .slide-title {
    font-size: 2.5rem;
  }

  .slide-description {
    font-size: 1.25rem;
  }

  .feature-item {
    font-size: 1rem;
    padding: 1rem 1.5rem;
  }

  .brand-logo {
    padding: 0.8rem 1.5rem;
  }

  .brand-logo .logo {
    height: 40px;
  }

  .control-btn {
    width: 45px;
    height: 45px;
  }
  
  .control-btn svg {
    width: 24px;
    height: 24px;
  }
  
  .indicator {
    width: 12px;
    height: 12px;
  }

  .slide-features {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style> 