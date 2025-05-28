<template>
  <MainLayout>
    <div class="printer-container">
      <div class="printer-header">
        <div class="header-content">
          <div class="header-left">
            <h2 class="printer-title">Kiểm tra Máy in</h2>
            <p class="printer-subtitle">Quản lý và kiểm tra trạng thái máy in</p>
          </div>
          <div class="header-right">
            <div class="printer-controls">
              <div class="printer-select-wrapper">
                <div class="select-wrapper" @click="togglePrinterList">
                  <div class="select-display">
                    <span class="select-text">{{ selectedPrinter ? getPrinterName : 'Chọn máy in' }}</span>
                  </div>
                  <span class="select-arrow">▼</span>
                </div>
                <div class="printer-list" v-if="showPrinterList">
                  <div class="printer-item" v-for="printer in printers" :key="printer.id" @click="selectPrinter(printer)">
                    {{ printer.name }}
                  </div>
                </div>
              </div>
              <button class="printer-button" @click="getPrinterList" :disabled="isLoading">
                {{ isLoading ? 'Đang tải...' : 'Lấy danh sách' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Thanh tiến trình -->
      <div class="progress-container" v-if="isPrinting">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: printProgress + '%' }">
          </div>
        </div>
        <div class="progress-info">
          <span class="progress-text">{{ printProgress }}%</span>
          <span class="progress-status">Đang in...</span>
        </div>
      </div>

      <!-- Phần Cấu hình in -->
      <div class="print-settings">
        <div class="settings-group">
          <div class="section-header">
            <h3>Cấu hình in</h3>
          </div>
          <div class="settings-grid">
            <div class="setting-item">
              <label>Số lượng bản in</label>
              <input 
                type="number" 
                v-model="copies" 
                min="1" 
                max="999" 
                class="quantity-input"
              >
            </div>

            <div class="setting-item">
              <label>Kích thước giấy</label>
              <select v-model="paperSize" class="setting-select">
                <option value="A4">A4 (210 x 297 mm)</option>
                <option value="A5">A5 (148 x 210 mm)</option>
                <option value="Letter">Letter (216 x 279 mm)</option>
                <option value="Legal">Legal (216 x 356 mm)</option>
              </select>
            </div>

            <div class="setting-item">
              <label>Hướng giấy</label>
              <div class="orientation-buttons">
                <button 
                  class="orientation-button" 
                  :class="{ active: orientation === 'portrait' }" 
                  @click="orientation = 'portrait'"
                >
                  Dọc
                </button>
                <button 
                  class="orientation-button" 
                  :class="{ active: orientation === 'landscape' }" 
                  @click="orientation = 'landscape'"
                >
                  Ngang
                </button>
              </div>
            </div>

            <div class="setting-item">
              <label>Chất lượng in</label>
              <select v-model="printQuality" class="setting-select">
                <option value="draft">Nháp (Draft)</option>
                <option value="normal">Thường (Normal)</option>
                <option value="high">Cao (High)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Xem trước bản in -->
        <div class="preview-section">
          <div class="section-header">
            <h3>Xem trước bản in</h3>
          </div>
          <div class="preview-container" :class="orientation">
            <div class="preview-content">
              <div class="preview-header">
                <h4>Mẫu in thử nghiệm</h4>
                <p>Ngày in: {{ currentDate }}</p>
              </div>
              <div class="preview-body">
                <p>Thông tin máy in:</p>
                <ul>
                  <li>Tên máy in: {{ selectedPrinter ? getPrinterName : 'Chưa chọn máy in' }}</li>
                  <li>Kích thước: {{ paperSize }}</li>
                  <li>Hướng giấy: {{ orientation === 'portrait' ? 'Dọc' : 'Ngang' }}</li>
                  <li>Chất lượng: {{ getPrintQualityText }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Phần Footer với các nút điều khiển -->
      <div class="printer-actions">
        <div class="action-buttons">
          <button class="action-button primary" @click="printTest" :disabled="!selectedPrinter || isPrinting">
            {{ isPrinting ? 'Đang in...' : 'In thử' }}
          </button>
          
          <button class="action-button danger" @click="cancelPrint" :disabled="!isPrinting">
            Hủy in
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import MainLayout from '@/components/layouts/MainLayout.vue'

const printers = ref([])
const selectedPrinter = ref('')
const isLoading = ref(false)
const isPrinting = ref(false)
const showAllPrinters = ref(false)
const showPrinterList = ref(false)
const printProgress = ref(0)

// Cấu hình in
const copies = ref(1)
const paperSize = ref('A4')
const orientation = ref('portrait')
const printQuality = ref('normal')

// Computed properties
const currentDate = computed(() => {
  return new Date().toLocaleDateString('vi-VN')
})

const getPrinterName = computed(() => {
  const printer = printers.value.find(p => p.id === selectedPrinter.value)
  return printer ? printer.name : 'Không xác định'
})

const getPrintQualityText = computed(() => {
  const qualities = {
    draft: 'Nháp',
    normal: 'Thường',
    high: 'Cao'
  }
  return qualities[printQuality.value] || 'Thường'
})

// Methods
const togglePrinterList = () => {
  showPrinterList.value = !showPrinterList.value
}

const selectPrinter = (printer) => {
  selectedPrinter.value = printer.id
  showPrinterList.value = false
}

const getPrinterList = async () => {
  try {
    isLoading.value = true
    // Giả lập lấy danh sách máy in
    await new Promise(resolve => setTimeout(resolve, 1000))
    printers.value = [
      { id: 'printer1', name: 'HP LaserJet Pro M404n' },
      { id: 'printer2', name: 'Epson L3150' },
      { id: 'printer3', name: 'Canon PIXMA G7070' }
    ]
    
    if (printers.value.length && !selectedPrinter.value) {
      selectedPrinter.value = printers.value[0].id
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách máy in:', error)
    alert('Không thể lấy danh sách máy in. Vui lòng thử lại.')
  } finally {
    isLoading.value = false
  }
}

const printTest = async () => {
  try {
    isPrinting.value = true
    printProgress.value = 0
    
    const interval = setInterval(() => {
      printProgress.value += 2
      if (printProgress.value >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          isPrinting.value = false
          printProgress.value = 0
          alert('In thử nghiệm thành công!')
        }, 500)
      }
    }, 50)
  } catch (error) {
    console.error('Lỗi khi in:', error)
    alert('Không thể in. Vui lòng thử lại.')
    isPrinting.value = false
    printProgress.value = 0
  }
}

const cancelPrint = () => {
  isPrinting.value = false
  printProgress.value = 0
  alert('Đã hủy lệnh in!')
}

// Tự động lấy danh sách máy in khi component được tạo
getPrinterList()
</script>

<style scoped>
.printer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.printer-header {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.header-left {
  flex: 0 0 auto;
}

.header-right {
  flex: 1;
  max-width: 800px;
}

.printer-title {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.printer-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}

.printer-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.printer-select-wrapper {
  flex: 0 0 auto;
  min-width: 200px;
  max-width: 300px;
  position: relative;
}

.select-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-wrapper:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px var(--shadow-color);
}

.select-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.select-text {
  color: var(--text-primary);
  font-size: 1rem;
}

.select-arrow {
  color: var(--text-secondary);
  font-size: 12px;
  transition: transform 0.3s ease;
}

.select-wrapper:hover .select-arrow {
  transform: translateY(2px);
}

.printer-list {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--shadow-color);
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
  animation: slideDown 0.3s ease;
  border: 1px solid var(--border-color);
}

.printer-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.printer-item:hover {
  background: var(--bg-secondary);
  color: var(--primary-color);
}

.printer-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.printer-button:hover:not(:disabled) {
  background: var(--primary-dark);
}

.printer-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

/* Progress styling */
.progress-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--shadow-color);
  margin-bottom: 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
  position: relative;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
}

.progress-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-color);
}

.progress-status {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.print-settings {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.settings-group,
.preview-section {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.settings-group h3,
.preview-section h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 0;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 1rem;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-item label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.setting-select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.875rem;
  width: 100%;
}

.quantity-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.875rem;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.quantity-input::-webkit-inner-spin-button,
.quantity-input::-webkit-outer-spin-button {
  opacity: 1;
  height: 2em;
}

.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon-text {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.btn-icon-text.active {
  background: var(--primary-color);
  color: white;
}

.preview-container {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px var(--shadow-color);
  aspect-ratio: 1/1.414;
  overflow: hidden;
}

.preview-container.landscape {
  aspect-ratio: 1.414/1;
}

.preview-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.preview-header {
  text-align: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.preview-header h4 {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.preview-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.printer-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.action-button {
  min-width: 120px;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.action-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.action-button.primary {
  background: var(--primary-color);
}

.action-button.primary:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.action-button.danger {
  background: var(--danger-color);
}

.action-button.danger:hover:not(:disabled) {
  background: var(--danger-dark);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .printer-container {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-right {
    width: 100%;
  }

  .printer-controls {
    flex-direction: column;
    width: 100%;
  }

  .printer-select-wrapper {
    width: 100%;
    max-width: none;
  }

  .print-settings {
    grid-template-columns: 1fr;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .printer-actions {
    flex-direction: column;
  }

  .action-buttons {
    width: 100%;
  }

  .action-button {
    flex: 1;
  }
}

.orientation-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.orientation-button {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.orientation-button:hover {
  border-color: var(--primary-color);
  background: var(--bg-secondary);
}

.orientation-button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}
</style>
