<template>
  <div class="guide-container">
    <div class="guide-header">
      <img src="@/assets/icons/fis-logo.svg" alt="FPT IS" class="guide-logo" @click="goToGuestMode" />
      <h1 class="guide-title">Hướng dẫn sử dụng</h1>
      <p class="guide-subtitle">Tìm hiểu cách sử dụng các tính năng của hệ thống</p>
    </div>

    <div class="guide-content">
      <div class="guide-section" v-for="(section, index) in guideSections" :key="index">
        <div class="section-header">
          <div class="section-icon">
            <component :is="section.icon" />
          </div>
          <h2>{{ section.title }}</h2>
        </div>
        <div class="section-content">
          <div v-for="(step, stepIndex) in section.steps" :key="stepIndex" class="guide-step">
            <div class="step-number">{{ stepIndex + 1 }}</div>
            <div class="step-content">
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
              <div v-if="step.image" class="step-image">
                <img :src="step.image" :alt="step.title" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="guide-footer">
      <button class="back-button" @click="goToGuestMode">
        <span class="button-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </span>
        <span>Quay lại</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { 
  IdentificationIcon, 
  DocumentTextIcon, 
  QrCodeIcon, 
  ShieldCheckIcon 
} from '@heroicons/vue/24/outline'

const router = useRouter()

const guideSections = [
  {
    title: 'Xác thực bằng CCCD',
    icon: IdentificationIcon,
    steps: [
      {
        title: 'Chọn phương thức xác thực',
        description: 'Từ màn hình chính, chọn phương thức "Căn cước công dân"',
        image: new URL('@/assets/icons/cccd.jpg', import.meta.url).href
      },
      {
        title: 'Đặt CCCD vào vị trí',
        description: 'Đặt CCCD vào khung quét theo hướng dẫn trên màn hình',
        image: null
      },
      {
        title: 'Xác nhận thông tin',
        description: 'Kiểm tra và xác nhận thông tin được hiển thị trên màn hình',
        image: null
      }
    ]
  },
  {
    title: 'Xác thực bằng Hộ chiếu',
    icon: DocumentTextIcon,
    steps: [
      {
        title: 'Chọn phương thức xác thực',
        description: 'Từ màn hình chính, chọn phương thức "Passport"',
        image: new URL('@/assets/icons/passport.png', import.meta.url).href
      },
      {
        title: 'Đặt hộ chiếu vào vị trí',
        description: 'Đặt hộ chiếu vào khung quét theo hướng dẫn trên màn hình',
        image: null
      },
      {
        title: 'Xác nhận thông tin',
        description: 'Kiểm tra và xác nhận thông tin được hiển thị trên màn hình',
        image: null
      }
    ]
  },
  {
    title: 'Đọc mã QR/QBar',
    icon: QrCodeIcon,
    steps: [
      {
        title: 'Chọn chức năng đọc mã',
        description: 'Từ màn hình chính, chọn chức năng "Đọc QR".',
        image: null
      },
      {
        title: 'Đưa mã vào khung quét',
        description: 'Đưa mã QR hoặc QBar vào khung quét trên màn hình. Hệ thống sẽ tự động nhận diện và hiển thị nội dung mã.',
        image: null
      },
      {
        title: 'Xem kết quả',
        description: 'Nội dung mã sẽ hiển thị trên màn hình sau khi quét thành công. Không có xác thực, chỉ dùng để đọc thông tin.',
        image: null
      }
    ]
  },
  {
    title: 'Bảo mật thông tin',
    icon: ShieldCheckIcon,
    steps: [
      {
        title: 'Bảo mật dữ liệu',
        description: 'Hệ thống đảm bảo bảo mật thông tin cá nhân của bạn theo quy định của pháp luật',
        image: null
      },
      {
        title: 'Mã hóa thông tin',
        description: 'Tất cả thông tin được mã hóa và lưu trữ an toàn',
        image: null
      },
      {
        title: 'Xóa dữ liệu',
        description: 'Dữ liệu sẽ được xóa sau khi hoàn tất quá trình xác thực',
        image: null
      }
    ]
  }
]

function goToGuestMode() {
  router.push({ name: 'SelectAuthMethodView' })
}
</script>

<style scoped>
.guide-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.guide-header {
  text-align: center;
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.guide-logo {
  width: 120px;
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.guide-logo:hover {
  transform: scale(1.05);
}

.guide-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.5rem;
}

.guide-subtitle {
  font-size: 1.2rem;
  color: #4a5568;
}

.guide-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem 2rem;
}

.guide-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.guide-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.section-icon {
  width: 48px;
  height: 48px;
  background: #ebf8ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2b6cb0;
}

.section-icon :deep(svg) {
  width: 24px;
  height: 24px;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.guide-step {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.guide-step:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #4299e1;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.step-content p {
  font-size: 1rem;
  color: #4a5568;
  margin: 0;
  line-height: 1.5;
}

.step-image {
  margin-top: 1rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.step-image img {
  width: 100%;
  height: auto;
  display: block;
}

.guide-footer {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
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
  color: #2b6cb0;
  background: white;
  border: 2px solid #2b6cb0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #2b6cb0;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(43, 108, 176, 0.2);
}

.button-icon {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .guide-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .guide-header {
    padding: 1rem 1rem 0.5rem;
  }

  .guide-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0.5rem 1rem;
  }

  .guide-section {
    padding: 1.5rem;
  }

  .guide-footer {
    padding: 1rem;
  }

  .guide-title {
    font-size: 2rem;
  }

  .guide-subtitle {
    font-size: 1rem;
  }
}
</style> 