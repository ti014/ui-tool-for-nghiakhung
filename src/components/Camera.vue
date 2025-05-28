<template>
  <div class="camera-container">
    <video ref="video" :class="{ 'hidden': !isStreaming }" autoplay playsinline></video>
    <canvas ref="canvas" class="hidden"></canvas>
    <div class="camera-controls">
      <button @click="startCamera" :disabled="isStreaming">Bật Camera</button>
      <button @click="stopCamera" :disabled="!isStreaming">Tắt Camera</button>
      <button @click="captureImage" :disabled="!isStreaming">Chụp ảnh</button>
    </div>
    <div v-if="capturedImage" class="captured-image">
      <img :src="capturedImage" alt="Captured image" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Camera',
  data() {
    return {
      isStreaming: false,
      stream: null,
      capturedImage: null
    }
  },
  methods: {
    async startCamera() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false
        });
        this.$refs.video.srcObject = this.stream;
        this.isStreaming = true;
      } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
      }
    },
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.$refs.video.srcObject = null;
        this.isStreaming = false;
        this.capturedImage = null;
      }
    },
    captureImage() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to image
      this.capturedImage = canvas.toDataURL('image/png');
      
      // Emit the captured image to parent component
      this.$emit('image-captured', this.capturedImage);
    }
  },
  beforeUnmount() {
    this.stopCamera();
  }
}
</script>

<style scoped>
.camera-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

video {
  width: 100%;
  max-width: 640px;
  border-radius: 8px;
  background-color: #000;
}

.hidden {
  display: none;
}

.camera-controls {
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

.captured-image {
  margin-top: 1rem;
}

.captured-image img {
  max-width: 640px;
  border-radius: 8px;
  border: 2px solid #ddd;
}
</style> 