<template>
  <div class="printer-view">
    <div class="printer-container">
      <!-- Phần Header -->
      <div class="printer-header">
        <h2>Kiểm tra Máy in</h2>
        <div class="printer-controls">
          <button 
            class="btn btn-primary" 
            @click="getPrinterList"
            :disabled="isLoading"
          >
            <span class="icon refresh"></span>
            Lấy danh sách máy in
          </button>
          <div class="printer-select-wrapper">
            <select 
              v-model="selectedPrinter" 
              class="printer-select"
              :disabled="!printers.length"
            >
              <option value="">Chọn máy in</option>
              <option 
                v-for="printer in printers" 
                :key="printer.id" 
                :value="printer.id"
              >
                {{ printer.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Phần Cấu hình in -->
      <div class="print-settings">
        <div class="settings-group">
          <h3>Cấu hình in</h3>
          <div class="settings-grid">
            <!-- Số lượng bản in -->
            <div class="setting-item">
              <label>Số lượng bản in</label>
              <div class="quantity-control">
                <button 
                  class="btn btn-icon" 
                  @click="decreaseCopies"
                  :disabled="copies <= 1"
                >-</button>
                <input 
                  type="number" 
                  v-model="copies" 
                  min="1" 
                  max="999"
                  class="quantity-input"
                >
                <button 
                  class="btn btn-icon"
                  @click="increaseCopies"
                  :disabled="copies >= 999"
                >+</button>
              </div>
            </div>

            <!-- Kích thước giấy -->
            <div class="setting-item">
              <label>Kích thước giấy</label>
              <select v-model="paperSize" class="setting-select">
                <option value="A4">A4 (210 x 297 mm)</option>
                <option value="A5">A5 (148 x 210 mm)</option>
                <option value="Letter">Letter (216 x 279 mm)</option>
                <option value="Legal">Legal (216 x 356 mm)</option>
              </select>
            </div>

            <!-- Hướng giấy -->
            <div class="setting-item">
              <label>Hướng giấy</label>
              <div class="orientation-buttons">
                <button 
                  class="btn btn-icon-text"
                  :class="{ active: orientation === 'portrait' }"
                  @click="orientation = 'portrait'"
                >
                  <span class="icon portrait"></span>
                  Dọc
                </button>
                <button 
                  class="btn btn-icon-text"
                  :class="{ active: orientation === 'landscape' }"
                  @click="orientation = 'landscape'"
                >
                  <span class="icon landscape"></span>
                  Ngang
                </button>
              </div>
            </div>

            <!-- Chất lượng in -->
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
          <h3>Xem trước bản in</h3>
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
                <div class="test-pattern">
                  <div class="color-bars">
                    <div class="color-bar black"></div>
                    <div class="color-bar cyan"></div>
                    <div class="color-bar magenta"></div>
                    <div class="color-bar yellow"></div>
                  </div>
                  <p class="test-text">
                    This is a test print. Đây là bản in thử nghiệm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Phần Footer với các nút điều khiển -->
      <div class="printer-actions">
        <div class="action-group">
          <label class="show-all-checkbox">
            <input 
              type="checkbox" 
              v-model="showAllPrinters"
              @change="getPrinterList"
            >
            <span class="checkbox-label">Hiển thị tất cả máy in</span>
          </label>
        </div>
        <div class="action-group buttons">
          <button 
            class="btn btn-success" 
            @click="printTest"
            :disabled="!selectedPrinter || isPrinting"
          >
            <span class="icon print"></span>
            {{ isPrinting ? 'Đang in...' : 'In thử' }}
          </button>
          
          <button 
            class="btn btn-danger" 
            @click="cancelPrint"
            :disabled="!isPrinting"
          >
            <span class="icon stop"></span>
            Hủy in
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const printers = ref([])
const selectedPrinter = ref('')
const isLoading = ref(false)
const isPrinting = ref(false)
const showAllPrinters = ref(false)

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

const increaseCopies = () => {
  if (copies.value < 999) copies.value++
}

const decreaseCopies = () => {
  if (copies.value > 1) copies.value--
}

const printTest = async () => {
  try {
    isPrinting.value = true
    // Giả lập quá trình in
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('In thử nghiệm thành công!')
  } catch (error) {
    console.error('Lỗi khi in:', error)
    alert('Không thể in. Vui lòng thử lại.')
  } finally {
    isPrinting.value = false
  }
}

const cancelPrint = () => {
  isPrinting.value = false
  alert('Đã hủy lệnh in!')
}

// Tự động lấy danh sách máy in khi component được tạo
getPrinterList()
</script>

<style scoped>
.printer-view {
  height: calc(100vh - var(--header-height) - var(--footer-height));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--bg-secondary);
}

.printer-container {
  width: 100%;
  max-width: 1000px;
  height: 100%;
  max-height: min(800px, calc(100vh - var(--header-height) - var(--footer-height) - 2rem));
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 1.25rem;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.dark .printer-container {
  background: #2a2a2a;
}

.printer-header {
  margin-bottom: 0;
}

.printer-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2a2a2a;
}

.dark .printer-header h2 {
  color: #ffffff;
}

.printer-controls {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: center;
}

.printer-select-wrapper {
  position: relative;
}

.printer-select,
.setting-select {
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

.dark .printer-select,
.dark .setting-select {
  background-color: #3a3a3a;
  border-color: #4a4a4a;
  color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
}

.print-settings {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.settings-group,
.preview-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.25rem;
}

.dark .settings-group,
.dark .preview-section {
  background: #333333;
}

.settings-group h3,
.preview-section h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #2a2a2a;
}

.dark .settings-group h3,
.dark .preview-section h3 {
  color: #ffffff;
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-item label {
  font-size: 0.875rem;
  color: #666666;
}

.dark .setting-item label {
  color: #999999;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-input {
  width: 60px;
  text-align: center;
  padding: 0.375rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.875rem;
}

.dark .quantity-input {
  background: #3a3a3a;
  border-color: #4a4a4a;
  color: #ffffff;
}

.btn-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 6px;
  background: #f0f0f0;
  color: #2a2a2a;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .btn-icon {
  background: #4a4a4a;
  color: #ffffff;
}

.orientation-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon-text {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: #f0f0f0;
  color: #2a2a2a;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dark .btn-icon-text {
  background: #4a4a4a;
  color: #ffffff;
}

.btn-icon-text.active {
  background: #2196f3;
  color: #ffffff;
}

.preview-container {
  background: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  aspect-ratio: 1/1.414; /* A4 ratio */
  overflow: hidden;
}

.preview-container.landscape {
  aspect-ratio: 1.414/1;
}

.dark .preview-container {
  background: #2a2a2a;
  color: #ffffff;
}

.preview-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.75rem;
}

.preview-header {
  text-align: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.dark .preview-header {
  border-bottom-color: #4a4a4a;
}

.preview-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.test-pattern {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.color-bars {
  display: flex;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
}

.color-bar {
  flex: 1;
}

.color-bar.black { background: #000000; }
.color-bar.cyan { background: #00bcd4; }
.color-bar.magenta { background: #e91e63; }
.color-bar.yellow { background: #ffeb3b; }

.test-text {
  text-align: center;
  font-family: monospace;
}

.printer-actions {
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
  .printer-view {
    padding: 0.75rem;
    height: calc(100vh - var(--header-height) - var(--footer-height));
  }

  .printer-container {
    max-height: calc(100vh - var(--header-height) - var(--footer-height) - 1.5rem);
    padding: 1rem;
    gap: 1rem;
  }

  .printer-controls {
    grid-template-columns: 1fr;
  }

  .print-settings {
    grid-template-columns: 1fr;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .printer-actions {
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
