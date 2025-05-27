<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>Không tìm thấy trang</h2>
      <p>Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <router-link to="/" class="home-link" title="Về trang chủ">
        <span class="home-icon"></span>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--nav-height) - var(--footer-height));
  padding: 2rem;
  text-align: center;
}

.not-found-content {
  max-width: 600px;
}

h1 {
  font-size: 6rem;
  color: var(--primary-color);
  margin: 0;
  line-height: 1;
}

h2 {
  font-size: 2rem;
  color: var(--text-primary);
  margin: 1rem 0;
}

p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.home-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 50%;
  transition: all var(--transition-speed) ease;
}

.home-link:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
}

.home-link .home-icon {
  width: 24px;
  height: 24px;
  background-image: url('@/assets/icons/home-icon.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.dark .home-link .home-icon {
  filter: brightness(0) invert(1);
}
</style>
