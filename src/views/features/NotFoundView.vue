<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">Không tìm thấy trang</h1>
      <p class="error-message">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <div class="action-buttons">
        <button class="action-button primary" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Quay lại
        </button>
        <button class="action-button" @click="goHome">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Về trang chủ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ef 0%, #f8fafc 100%), url('https://www.transparenttextures.com/patterns/cubes.png');
  background-blend-mode: lighten;
  padding: 2rem;
}

.not-found-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 12px 48px rgba(33, 150, 243, 0.13), 0 2px 12px rgba(255, 152, 0, 0.09);
  max-width: 600px;
  width: 100%;
  backdrop-filter: blur(8px);
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #1976d2 0%, #43e97b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  line-height: 1;
  margin-bottom: 1rem;
  text-shadow: 0 4px 24px #43e97b33;
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 1rem;
  letter-spacing: 0.5px;
}

.error-message {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-button {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.action-button.primary {
  background: linear-gradient(135deg, #1976d2 0%, #43e97b 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
}

.action-button:not(.primary) {
  background: #fff;
  color: #666;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.action-button:hover {
  transform: translateY(-2px);
}

.action-button.primary:hover {
  background: linear-gradient(135deg, #43e97b 0%, #1976d2 100%);
  box-shadow: 0 6px 16px rgba(33, 150, 243, 0.25);
}

.action-button:not(.primary):hover {
  background: #f8fafc;
  border-color: #1976d2;
  color: #1976d2;
}

@media (max-width: 600px) {
  .not-found-container {
    padding: 1rem;
  }

  .not-found-content {
    padding: 2rem 1.5rem;
  }

  .error-code {
    font-size: 6rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-message {
    font-size: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }
}
</style> 