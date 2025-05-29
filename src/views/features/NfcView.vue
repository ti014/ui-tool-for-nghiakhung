<template>
  <MainLayout>
    <div class="nfc-container">
      <div class="nfc-content">
        <div class="nfc-header">
          <div class="header-content">
            <div class="header-left">
              <h2 class="nfc-title">NFC Reader</h2>
              <p class="nfc-subtitle">Đọc thông tin từ thẻ NFC</p>
            </div>
            <div class="header-right">
              <div class="device-input-group">
                <div class="device-selector">
                  <div class="select-wrapper" @click="toggleDeviceList">
                    <div class="select-display">
                      <span class="select-text">{{ selectedDevice ? 'Thiết bị đã chọn' : 'Chọn thiết bị NFC' }}</span>
                    </div>
                    <span class="select-arrow">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </div>
                  <div class="device-list" v-if="showDeviceList">
                    <div class="device-item" v-for="device in devices" :key="device.id" @click="selectDevice(device)">
                      {{ device.name }}
                    </div>
                  </div>
                </div>

                <div class="text-input">
                  <input 
                    type="text" 
                    v-model="inputText" 
                    placeholder="Nhập số CCCD..."
                    class="input-field"
                  >
                </div>

                <div class="scan-buttons">
                  <button class="scan-button" @click="startReading" :disabled="isReading || isAutoReading">
                    {{ isReading ? 'Đang đọc...' : 'Đọc thông tin' }}
                  </button>
                  <button class="scan-button auto" @click="startAutoReading" :disabled="isReading || isAutoReading">
                    {{ isAutoReading ? 'Đang đọc tự động...' : 'Đọc tự động' }}
                  </button>
                  <button class="scan-button stop" @click="stopReading" :disabled="!isReading && !isAutoReading">
                    Dừng đọc
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Thanh tiến trình -->
        <div class="progress-container" v-if="isReading || isAutoReading">
          <div class="progress-bar">
            <div class="progress-fill" :class="{ auto: isAutoReading }" :style="{ width: (isReading ? readProgress : autoReadProgress) + '%' }">
              <div class="progress-glow"></div>
              <div class="progress-particles"></div>
            </div>
          </div>
          <div class="progress-info">
            <span class="progress-text">{{ isReading ? readProgress : autoReadProgress }}%</span>
            <span class="progress-status">{{ isReading ? 'Đang đọc thông tin...' : 'Đang đọc tự động...' }}</span>
          </div>
        </div>

        <!-- Tùy chọn hiển thị -->
        <div class="nfc-section">
          <div class="section-header">
            <h3>Tùy chọn hiển thị</h3>
          </div>
          <div class="display-options">
            <div class="display-tabs">
              <button 
                v-for="option in displayOptions" 
                :key="option.id"
                :class="['display-tab', { active: activeDisplay === option.id }]"
                @click="activeDisplay = option.id"
              >
                {{ option.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Khu vực hiển thị dữ liệu -->
        <div class="nfc-section data-section">
          <div class="data-container">
            <!-- Log -->
            <div v-if="activeDisplay === 'log'" class="data-pane">
              <div class="log-container">
                <div v-for="(log, index) in logs" :key="index" class="log-entry" :class="log.type">
                  <span class="log-time">{{ log.time }}</span>
                  <span class="log-message">{{ log.message }}</span>
                </div>
              </div>
            </div>

            <!-- Thông tin cá nhân -->
            <div v-if="activeDisplay === 'info'" class="data-pane">
              <div class="info-container">
                <!-- Ảnh thẻ -->
                <div class="id-photo">
                  <div class="photo-section">
                    <div class="photo-wrapper id-photo-wrapper">
                      <img :src="idInfo.photo" alt="Ảnh thẻ" v-if="idInfo.photo">
                      <div class="photo-placeholder" v-else>
                        <span>Chưa có ảnh</span>
                      </div>
                    </div>
                    <span class="photo-label">Ảnh trên CCCD/Passport</span>
                  </div>
                  <div class="photo-section">
                    <div class="photo-wrapper current-photo-wrapper">
                      <img :src="idInfo.currentPhoto" alt="Ảnh hiện tại" v-if="idInfo.currentPhoto">
                      <div class="photo-placeholder" v-else>
                        <span>Chưa có ảnh</span>
                      </div>
                    </div>
                    <span class="photo-label">Ảnh chụp hiện tại</span>
                  </div>
                  <button class="action-button primary print-photo-button" @click="showPrintDialog">
                    In thông tin
                  </button>
                </div>

                <!-- Bảng thông tin -->
                <div class="info-table">
                  <div class="info-groups">
                    <!-- Thông tin cơ bản -->
                    <div class="info-group">
                      <h4 class="group-title">Thông tin cơ bản</h4>
                      <table>
                        <tbody>
                          <tr>
                            <td class="field-name">Số CCCD</td>
                            <td class="field-value">{{ idInfo.idNumber || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Họ và tên</td>
                            <td class="field-value">{{ idInfo.fullName || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Ngày sinh</td>
                            <td class="field-value">{{ idInfo.dateOfBirth || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Giới tính</td>
                            <td class="field-value">{{ idInfo.gender || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Quốc tịch</td>
                            <td class="field-value">{{ idInfo.nationality || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Dân tộc</td>
                            <td class="field-value">{{ idInfo.ethnicity || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Tôn giáo</td>
                            <td class="field-value">{{ idInfo.religion || '---' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <!-- Thông tin địa chỉ -->
                    <div class="info-group">
                      <h4 class="group-title">Thông tin địa chỉ</h4>
                      <table>
                        <tbody>
                          <tr>
                            <td class="field-name">Quê quán</td>
                            <td class="field-value">{{ idInfo.placeOfOrigin || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Nơi thường trú</td>
                            <td class="field-value">{{ idInfo.permanentAddress || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Nơi ở hiện tại</td>
                            <td class="field-value">{{ idInfo.currentAddress || '---' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <!-- Thông tin gia đình -->
                    <div class="info-group">
                      <h4 class="group-title">Thông tin gia đình</h4>
                      <table>
                        <tbody>
                          <tr>
                            <td class="field-name">Họ tên cha</td>
                            <td class="field-value">{{ idInfo.fatherName || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Họ tên mẹ</td>
                            <td class="field-value">{{ idInfo.motherName || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Họ tên vợ/chồng</td>
                            <td class="field-value">{{ idInfo.spouseName || '---' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <!-- Thông tin bổ sung -->
                    <div class="info-group">
                      <h4 class="group-title">Thông tin bổ sung</h4>
                      <table>
                        <tbody>
                          <tr>
                            <td class="field-name">Đặc điểm nhận dạng</td>
                            <td class="field-value">{{ idInfo.identifyingMarks || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Nhóm máu</td>
                            <td class="field-value">{{ idInfo.bloodType || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Mã số BHXH</td>
                            <td class="field-value">{{ idInfo.socialInsuranceNumber || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Mã số BHYT</td>
                            <td class="field-value">{{ idInfo.healthInsuranceNumber || '---' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <!-- Thông tin giấy tờ -->
                    <div class="info-group">
                      <h4 class="group-title">Thông tin giấy tờ</h4>
                      <table>
                        <tbody>
                          <tr>
                            <td class="field-name">Loại giấy tờ</td>
                            <td class="field-value">{{ idInfo.documentType || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Số giấy tờ</td>
                            <td class="field-value">{{ idInfo.idNumber || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Ngày cấp</td>
                            <td class="field-value">{{ idInfo.issueDate || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Nơi cấp</td>
                            <td class="field-value">{{ idInfo.issuePlace || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Ngày hết hạn</td>
                            <td class="field-value">{{ idInfo.expiryDate || '---' }}</td>
                          </tr>
                          <tr>
                            <td class="field-name">Mã số MRZ</td>
                            <td class="field-value">{{ idInfo.mrzCode || '---' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Nút cuộn lên đầu -->
                  <button 
                    class="scroll-top-button" 
                    @click="scrollToTop"
                    v-show="showScrollTop"
                  >
                    <span>↑</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dialog in thông tin -->
        <div v-if="showPrint" class="dialog-overlay" @click="closePrintDialog">
          <div class="print-dialog" @click.stop>
            <div class="dialog-header">
              <h3>Chọn thông tin cần in</h3>
              <button class="close-button" @click="closePrintDialog">×</button>
            </div>
            
            <div class="print-options">
              <div class="print-section">
                <h4>Thông tin cơ bản</h4>
                <div class="checkbox-group">
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.fullName">
                    <span>Họ và tên</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.dateOfBirth">
                    <span>Ngày sinh</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.gender">
                    <span>Giới tính</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.nationality">
                    <span>Quốc tịch</span>
                  </label>
                </div>
              </div>

              <div class="print-section">
                <h4>Thông tin địa chỉ</h4>
                <div class="checkbox-group">
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.placeOfOrigin">
                    <span>Quê quán</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.permanentAddress">
                    <span>Nơi thường trú</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.currentAddress">
                    <span>Nơi ở hiện tại</span>
                  </label>
                </div>
              </div>

              <div class="print-section">
                <h4>Thông tin gia đình</h4>
                <div class="checkbox-group">
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.fatherName">
                    <span>Họ tên cha</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.motherName">
                    <span>Họ tên mẹ</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.spouseName">
                    <span>Họ tên vợ/chồng</span>
                  </label>
                </div>
              </div>

              <div class="print-section">
                <h4>Thông tin khác</h4>
                <div class="checkbox-group">
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.idNumber">
                    <span>Số CMND/CCCD</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.issueDate">
                    <span>Ngày cấp</span>
                  </label>
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="printOptions.issuePlace">
                    <span>Nơi cấp</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="dialog-actions">
              <button class="dialog-button cancel" @click="closePrintDialog">
                Hủy
              </button>
              <button class="dialog-button print" @click="printSelectedInfo" :disabled="!hasSelectedOptions">
                In thông tin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import MainLayout from '@/components/layouts/MainLayout.vue'

export default {
  name: 'NFCView',
  components: {
    MainLayout
  },
  setup() {
    const selectedDevice = ref('')
    const devices = ref([
      { id: '1', name: 'NFC Reader 1' },
      { id: '2', name: 'NFC Reader 2' }
    ])
    const isReading = ref(false)
    const isAutoReading = ref(false)
    const showDeviceList = ref(false)
    const inputText = ref('')

    const displayOptions = [
      { id: 'log', name: 'Log' },
      { id: 'info', name: 'Thông tin cá nhân' }
    ]

    const activeDisplay = ref('log')
    const logs = ref([
      { time: '10:30:15', message: 'Đã kết nối thiết bị NFC', type: 'info' },
      { time: '10:30:20', message: 'Bắt đầu đọc thông tin', type: 'success' },
      { time: '10:30:25', message: 'Đã đọc thành công', type: 'success' }
    ])

    const idInfo = ref({
      photo: '',
      currentPhoto: '',
      documentType: 'Căn cước công dân',
      idNumber: '001234567890',
      fullName: 'Nguyễn Văn A',
      dateOfBirth: '01/01/1990',
      gender: 'Nam',
      nationality: 'Việt Nam',
      ethnicity: 'Kinh',
      religion: 'Không',
      placeOfOrigin: 'Hà Nội',
      permanentAddress: '123 Đường ABC, Quận XYZ, TP. Hà Nội',
      currentAddress: '456 Đường DEF, Quận UVW, TP. Hà Nội',
      fatherName: 'Nguyễn Văn B',
      motherName: 'Trần Thị C',
      spouseName: 'Lê Thị D',
      identifyingMarks: 'Nốt ruồi nhỏ ở cằm bên trái',
      issueDate: '01/01/2020',
      issuePlace: 'Công an TP. Hà Nội',
      expiryDate: '01/01/2030',
      socialInsuranceNumber: '1234567890',
      healthInsuranceNumber: '9876543210',
      bloodType: 'A',
      mrzCode: 'IDVN123456789012345678901234'
    })

    const showScrollTop = ref(false)
    const readProgress = ref(0)
    const autoReadProgress = ref(0)
    let readInterval = null
    let autoReadInterval = null

    const showPrint = ref(false)
    const printOptions = ref({
      fullName: true,
      dateOfBirth: true,
      gender: true,
      nationality: true,
      placeOfOrigin: true,
      permanentAddress: true,
      currentAddress: true,
      fatherName: true,
      motherName: true,
      spouseName: true,
      idNumber: true,
      issueDate: true,
      issuePlace: true
    })

    const handleScroll = () => {
      const infoTable = document.querySelector('.info-table')
      if (infoTable) {
        showScrollTop.value = infoTable.scrollTop > 100
      }
    }

    const scrollToTop = () => {
      const infoTable = document.querySelector('.info-table')
      if (infoTable) {
        infoTable.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }

    const toggleDeviceList = () => {
      showDeviceList.value = !showDeviceList.value
    }

    const selectDevice = (device) => {
      selectedDevice.value = device.id
      showDeviceList.value = false
      logs.value.unshift({
        time: new Date().toLocaleTimeString(),
        message: `Đã chọn thiết bị: ${device.name}`,
        type: 'info'
      })
    }

    const startReading = () => {
      if (isReading.value || isAutoReading.value) return
      
      isReading.value = true
      readProgress.value = 0
      
      readInterval = setInterval(() => {
        readProgress.value += 2
        if (readProgress.value >= 100) {
          clearInterval(readInterval)
          setTimeout(() => {
            isReading.value = false
            readProgress.value = 0
            logs.value.unshift({
              time: new Date().toLocaleTimeString(),
              message: 'Đọc thông tin thành công',
              type: 'success'
            })
          }, 500)
        }
      }, 50)
    }

    const startAutoReading = () => {
      if (isReading.value || isAutoReading.value) return
      
      isAutoReading.value = true
      autoReadProgress.value = 0
      
      autoReadInterval = setInterval(() => {
        autoReadProgress.value += 1
        if (autoReadProgress.value >= 100) {
          autoReadProgress.value = 0
          logs.value.unshift({
            time: new Date().toLocaleTimeString(),
            message: 'Đọc tự động thành công',
            type: 'success'
          })
        }
      }, 50)
    }

    const stopReading = () => {
      if (readInterval) {
        clearInterval(readInterval)
        readInterval = null
      }
      if (autoReadInterval) {
        clearInterval(autoReadInterval)
        autoReadInterval = null
      }
      
      isReading.value = false
      isAutoReading.value = false
      readProgress.value = 0
      autoReadProgress.value = 0
      
      logs.value.unshift({
        time: new Date().toLocaleTimeString(),
        message: 'Đã dừng đọc',
        type: 'info'
      })
    }

    const showPrintDialog = () => {
      showPrint.value = true
    }

    const closePrintDialog = () => {
      showPrint.value = false
    }

    const hasSelectedOptions = computed(() => {
      return Object.values(printOptions.value).some(value => value)
    })

    const printSelectedInfo = () => {
      // Tạo nội dung in dựa trên các tùy chọn được chọn
      const selectedInfo = []
      
      if (printOptions.value.fullName) selectedInfo.push(`Họ và tên: ${idInfo.value.fullName}`)
      if (printOptions.value.dateOfBirth) selectedInfo.push(`Ngày sinh: ${idInfo.value.dateOfBirth}`)
      if (printOptions.value.gender) selectedInfo.push(`Giới tính: ${idInfo.value.gender}`)
      if (printOptions.value.nationality) selectedInfo.push(`Quốc tịch: ${idInfo.value.nationality}`)
      if (printOptions.value.placeOfOrigin) selectedInfo.push(`Quê quán: ${idInfo.value.placeOfOrigin}`)
      if (printOptions.value.permanentAddress) selectedInfo.push(`Nơi thường trú: ${idInfo.value.permanentAddress}`)
      if (printOptions.value.currentAddress) selectedInfo.push(`Nơi ở hiện tại: ${idInfo.value.currentAddress}`)
      if (printOptions.value.fatherName) selectedInfo.push(`Họ tên cha: ${idInfo.value.fatherName}`)
      if (printOptions.value.motherName) selectedInfo.push(`Họ tên mẹ: ${idInfo.value.motherName}`)
      if (printOptions.value.spouseName) selectedInfo.push(`Họ tên vợ/chồng: ${idInfo.value.spouseName}`)
      if (printOptions.value.idNumber) selectedInfo.push(`Số CMND/CCCD: ${idInfo.value.idNumber}`)
      if (printOptions.value.issueDate) selectedInfo.push(`Ngày cấp: ${idInfo.value.issueDate}`)
      if (printOptions.value.issuePlace) selectedInfo.push(`Nơi cấp: ${idInfo.value.issuePlace}`)

      // Tạo cửa sổ in
      const printWindow = window.open('', '_blank')
      printWindow.document.write(`
        <html>
          <head>
            <title>Thông tin cá nhân</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                line-height: 1.6;
              }
              .print-header {
                text-align: center;
                margin-bottom: 20px;
              }
              .print-content {
                margin-bottom: 20px;
              }
              .print-item {
                margin-bottom: 10px;
              }
              .print-footer {
                text-align: center;
                margin-top: 20px;
                font-size: 0.9em;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h2>Thông tin cá nhân</h2>
              <p>Ngày in: ${new Date().toLocaleDateString('vi-VN')}</p>
            </div>
            <div class="print-content">
              ${selectedInfo.map(info => `<div class="print-item">${info}</div>`).join('')}
            </div>
            <div class="print-footer">
              <p>Được in từ hệ thống quản lý NFC</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
      closePrintDialog()
    }

    onMounted(() => {
      if (devices.value.length > 0) {
        selectedDevice.value = devices.value[0].id
      }

      const infoTable = document.querySelector('.info-table')
      if (infoTable) {
        infoTable.addEventListener('scroll', handleScroll)
      }
    })

    onUnmounted(() => {
      const infoTable = document.querySelector('.info-table')
      if (infoTable) {
        infoTable.removeEventListener('scroll', handleScroll)
      }
      if (readInterval) clearInterval(readInterval)
      if (autoReadInterval) clearInterval(autoReadInterval)
    })

    return {
      selectedDevice,
      devices,
      isReading,
      isAutoReading,
      showDeviceList,
      inputText,
      displayOptions,
      activeDisplay,
      logs,
      idInfo,
      showScrollTop,
      scrollToTop,
      toggleDeviceList,
      selectDevice,
      startReading,
      startAutoReading,
      stopReading,
      readProgress,
      autoReadProgress,
      showPrint,
      printOptions,
      showPrintDialog,
      closePrintDialog,
      hasSelectedOptions,
      printSelectedInfo
    }
  }
}
</script>

<style scoped>
.nfc-container {
  padding: 2.5rem;
  background: var(--bg-secondary);
  min-height: calc(100vh - var(--nav-height) - var(--footer-height));
}

.nfc-content {
  max-width: 1200px;
  margin: 0 auto;
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.nfc-header {
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

.nfc-title {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.nfc-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}

.device-input-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.device-selector {
  flex: 0 0 auto;
  min-width: 160px;
  max-width: 180px;
}

.select-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-wrapper:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.select-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.select-text {
  color: var(--text-primary);
  font-size: 0.875rem;
}

.select-arrow {
  color: var(--text-secondary);
  transition: transform 0.3s ease;
}

.select-wrapper:hover .select-arrow {
  transform: translateY(2px);
}

.device-list {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
  animation: slideDown 0.3s ease;
}

.device-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.device-item:hover {
  background: var(--bg-secondary);
  color: var(--primary-color);
}

.text-input {
  flex: 0 0 auto;
  min-width: 180px;
  max-width: 200px;
}

.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--bg-primary);
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nfc-section {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.nfc-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.main-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.scan-buttons {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  justify-content: flex-end;
}

.scan-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: var(--primary-color, #7C9CBF);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 110px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  user-select: none;
  position: relative;
  z-index: 2;
}

.scan-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: var(--primary-dark, #6B8BAF);
}

.scan-button.auto {
  background: var(--info-color, #A5D8FF);
}

.scan-button.auto:hover:not(:disabled) {
  background: var(--info-dark, #95C8EF);
}

.scan-button.stop {
  background: var(--danger-color, #FFB4B4);
}

.scan-button.stop:hover:not(:disabled) {
  background: var(--danger-dark, #FFA4A4);
}

.scan-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.progress-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress-fill.auto {
  background: linear-gradient(90deg, var(--primary-light), var(--primary-color));
}

.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: glow 1.5s infinite;
}

.progress-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, transparent 50%),
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.8) 0%, transparent 50%);
  background-size: 200% 200%;
  animation: particles 2s linear infinite;
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
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  -webkit-text-fill-color: transparent;
}

.progress-status {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

@keyframes glow {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes particles {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 200%;
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0 0.5rem;
}

.section-icon {
  width: 18px;
  height: 18px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.section-header h3 {
  font-size: 1rem;
  color: var(--text-primary);
  margin: 0;
}

.display-options {
  margin-top: 0.5rem;
}

.display-tabs {
  display: flex;
  gap: 0.75rem;
}

.display-tab {
  padding: 0.625rem 1.25rem;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.display-tab:hover {
  background: var(--primary-light);
}

.display-tab.active {
  background: var(--primary-color);
  color: white;
}

.data-section {
  min-height: 400px;
}

.data-container {
  height: 100%;
}

.data-pane {
  height: 100%;
}

.log-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.log-entry {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.log-entry.info {
  background: rgba(66, 153, 225, 0.1);
}

.log-entry.success {
  background: rgba(72, 187, 120, 0.1);
}

.log-entry.error {
  background: rgba(245, 101, 101, 0.1);
}

.log-time {
  color: var(--text-secondary);
  min-width: 80px;
}

.info-container {
  display: flex;
  gap: 2rem;
  padding: 1rem;
}

.id-photo {
  flex: 0 0 250px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.photo-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.photo-wrapper {
  width: 100%;
  background: var(--bg-secondary);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
}

.id-photo-wrapper {
  aspect-ratio: 3/4;
  max-height: 280px;
  border: 2px solid var(--primary-color);
}

.current-photo-wrapper {
  aspect-ratio: 1/1;
  max-height: 200px;
  border: 2px solid var(--light-orange);
}

.photo-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-label {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  background: var(--bg-secondary);
  border-radius: 4px;
  display: inline-block;
  margin: 0 auto;
}

.id-photo-wrapper + .photo-label {
  color: var(--primary-color);
}

.current-photo-wrapper + .photo-label {
  color: var(--light-orange);
}

.photo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
}

.info-table {
  flex: 1;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 1rem;
  position: relative;
}

.info-table::-webkit-scrollbar {
  width: 8px;
}

.info-table::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 4px;
}

.info-table::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

.info-table::-webkit-scrollbar-thumb:hover {
  background: var(--primary-dark);
}

.info-groups {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-group {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-group:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.group-title {
  color: var(--primary-color);
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border-color);
}

.info-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.info-table tr:last-child td {
  border-bottom: none;
}

.field-name {
  width: 150px;
  color: var(--text-secondary);
  font-weight: 500;
}

.field-value {
  color: var(--text-primary);
}

.scroll-top-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.scroll-top-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  background: var(--primary-dark);
}

.dialog-overlay {
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
}

.print-dialog {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.dialog-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.3rem;
}

.close-button {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
}

.print-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.print-section {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1rem;
}

.print-section h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  border: 2px solid var(--primary-color);
  border-radius: 4px;
  appearance: none;
  cursor: pointer;
  position: relative;
  background: var(--bg-primary);
}

.checkbox-item input[type="checkbox"]:checked {
  background: var(--primary-color);
}

.checkbox-item input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 12px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.dialog-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-button.cancel {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.dialog-button.cancel:hover {
  background: var(--bg-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dialog-button.print {
  background: var(--primary-color);
  color: white;
  border: none;
}

.dialog-button.print:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dialog-button.print:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.print-photo-button {
  width: 100%;
  padding: 0.625rem;
  font-size: 0.9rem;
  border-radius: 8px;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.print-photo-button:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-right {
    width: 100%;
  }

  .device-input-group {
    flex-direction: column;
    width: 100%;
  }

  .device-selector,
  .text-input {
    width: 100%;
    max-width: none;
  }

  .scan-buttons {
    flex-direction: column;
    width: 100%;
  }

  .scan-button {
    width: 100%;
  }

  .display-tabs {
    flex-direction: column;
  }

  .display-tab {
    width: 100%;
    text-align: center;
  }

  .print-dialog {
    width: 95%;
    padding: 1rem;
  }

  .checkbox-group {
    grid-template-columns: 1fr;
  }

  .dialog-actions {
    flex-direction: column;
  }

  .dialog-button {
    width: 100%;
  }

  .id-photo {
    flex: 0 0 auto;
    width: 100%;
    max-width: 250px;
    margin: 0 auto;
  }
}
</style>
