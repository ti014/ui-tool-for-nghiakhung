// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
// Import các view khác
// import CameraView from '../views/features/CameraView.vue';
// import SettingsView from '../views/features/SettingsView.vue';
// ...

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    // Ví dụ cho các route khác
    {
      path: "/all-features",
      name: "AllFeaturesView", // Phải khớp với routeName trong HomeView.vue
      // component: () => import('../views/features/AllFeaturesView.vue') // Lazy loading
      component: () =>
        import(
          /* webpackChunkName: "all-features" */ "../views/features/AllFeaturesView.vue"
        ),
    },
    {
      path: "/camera",
      name: "CameraView",
      component: () =>
        import(
          /* webpackChunkName: "camera" */ "../views/features/CameraView.vue"
        ),
    },
    {
      path: "/nfc",
      name: "NfcView",
      component: () =>
        import(/* webpackChunkName: "nfc" */ "../views/features/NfcView.vue"),
    },
    {
      path: "/printer",
      name: "PrinterView",
      component: () =>
        import(
          /* webpackChunkName: "printer" */ "../views/features/PrinterView.vue"
        ),
    },
    {
      path: "/ocr",
      name: "OcrView",
      component: () =>
        import(/* webpackChunkName: "ocr" */ "../views/features/OcrView.vue"),
    },
    {
      path: "/settings",
      name: "SettingsView",
      component: () =>
        import(
          /* webpackChunkName: "settings" */ "../views/features/SettingsView.vue"
        ),
    },
    // Catch all 404
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

export default router;
