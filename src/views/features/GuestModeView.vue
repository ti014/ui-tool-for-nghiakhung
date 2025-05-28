<template>
  <div class="guest-mode-container">
    <transition name="fade-slide" mode="out-in">
      <div v-if="showMainContent && $route.name === 'GuestModeView'" key="main-content" class="main-content">
        <SlideShow />
        <div class="start-button-container">
          <button class="start-button" @click="handleStart">
            <span class="button-content">
              <span class="button-text">BẮT ĐẦU</span>
              <span class="button-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </span>
            </span>
            <span class="button-glow"></span>
          </button>
        </div>
      </div>
    </transition>
    <router-view v-slot="{ Component }">
      <transition name="fade-slide" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SlideShow from '@/components/SlideShow.vue'

const showMainContent = ref(true)
const router = useRouter()
const route = useRoute()

function handleStart() {
  showMainContent.value = false
  setTimeout(() => {
    router.push({ name: 'SelectAuthMethodView' })
    setTimeout(() => {
      showMainContent.value = true
    }, 500)
  }, 500)
}
</script>

<style scoped>
.guest-mode-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.start-button-container {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.start-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 3.5rem;
  font-size: 2rem;
  font-weight: 900;
  color: white;
  background: linear-gradient(135deg, #FF8C42, #4CAF50);
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(255, 140, 66, 0.3);
  backdrop-filter: blur(5px);
  animation: colorCycle 12s ease-in-out infinite;
  animation: buttonPulse 2s infinite;
  animation: buttonGlow 3s ease-in-out infinite;
}

.button-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
}

.button-text {
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  text-transform: uppercase;
  font-weight: 900;
}

.button-icon {
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.button-icon svg {
  width: 28px;
  height: 28px;
  stroke-width: 3;
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4CAF50, #2196F3);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.start-button:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(255, 140, 66, 0.4), 0 0 40px rgba(255, 140, 66, 0.2);
  animation: none;
}

.start-button:hover .button-glow {
  opacity: 1;
  background: linear-gradient(135deg, #2196F3, #FF8C42);
}

.start-button:hover .button-icon {
  transform: translateX(5px);
}

.start-button:active {
  transform: translateY(-1px) scale(0.98);
}

@keyframes colorCycle {
  0% {
    background: linear-gradient(135deg, #FF8C42, #4CAF50);
  }
  20% {
    background: linear-gradient(135deg, #FF9F5A, #3CB371);
  }
  40% {
    background: linear-gradient(135deg, #4CAF50, #2196F3);
  }
  60% {
    background: linear-gradient(135deg, #3CB371, #1E90FF);
  }
  80% {
    background: linear-gradient(135deg, #2196F3, #FF8C42);
  }
  100% {
    background: linear-gradient(135deg, #FF8C42, #4CAF50);
  }
}

@keyframes buttonPulse {
  0% {
    box-shadow: 0 4px 15px rgba(255, 140, 66, 0.3);
  }
  50% {
    box-shadow: 0 4px 25px rgba(255, 140, 66, 0.5);
  }
  100% {
    box-shadow: 0 4px 15px rgba(255, 140, 66, 0.3);
  }
}

.guest-mode-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2rem;
  overflow-y: auto;
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
}

.content-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h3 {
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
  font-weight: 600;
}

.user-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item label {
  font-size: 1rem;
  color: #fff;
  font-weight: 500;
}

.info-input {
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s ease;
}

.info-input:focus {
  outline: none;
  border-color: #0066B3;
  box-shadow: 0 0 0 2px rgba(0, 102, 179, 0.2);
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.service-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.service-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.service-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-card h4 {
  color: #fff;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.service-card p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin: 0;
}

@media (max-width: 768px) {
  .guest-mode-content {
    padding: 1rem;
  }

  .content-section {
    padding: 1.5rem;
  }

  .user-info {
    grid-template-columns: 1fr;
  }

  .service-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .service-card {
    padding: 1.5rem;
  }

  .service-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
  }

  .start-button {
    padding: 1rem 3rem;
    font-size: 1.75rem;
  }

  .button-icon svg {
    width: 24px;
    height: 24px;
  }

  .start-button-container {
    bottom: 60px;
  }
}

/* Cải thiện hiệu ứng transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.main-content {
  animation: contentFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
    filter: blur(5px);
  }
  to {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
}

/* Cải thiện hiệu ứng cho nút bắt đầu */
.start-button {
  animation: buttonGlow 3s ease-in-out infinite;
}

@keyframes buttonGlow {
  0% {
    box-shadow: 0 4px 15px rgba(255, 140, 66, 0.3);
  }
  50% {
    box-shadow: 0 4px 25px rgba(255, 140, 66, 0.5), 0 0 30px rgba(255, 140, 66, 0.2);
  }
  100% {
    box-shadow: 0 4px 15px rgba(255, 140, 66, 0.3);
  }
}

.start-button:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(255, 140, 66, 0.4), 0 0 40px rgba(255, 140, 66, 0.2);
  animation: none;
}
</style> 