// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
// Import các view khác
// import CameraView from '../views/features/CameraView.vue';
// import SettingsView from '../views/features/SettingsView.vue';
// ...
import ReadQrFlowView from "@/views/features/ReadQrFlowView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    // Ví dụ cho các route khác
    {
      path: "/all-features",
      name: "AllFeaturesView",
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
    {
      path: "/guest-mode",
      name: "GuestModeView",
      component: () =>
        import(
          /* webpackChunkName: "guest-mode" */ "../views/features/GuestModeView.vue"
        ),
      children: [
        {
          path: "select-auth",
          name: "SelectAuthMethodView",
          component: () => import("@/views/features/SelectAuthMethodView.vue"),
        },
        {
          path: "guide",
          name: "GuideView",
          component: () => import("@/views/features/GuideView.vue"),
        },
        {
          path: "read-cccd",
          name: "ReadCccdFlowView",
          component: () => import("@/views/features/ReadCccdFlowView.vue"),
        },
        {
          path: "read-passport",
          name: "ReadPassportFlowView",
          component: () => import("@/views/features/ReadPassportFlowView.vue"),
        },
        {
          path: "qr",
          name: "ReadQrFlowView",
          component: ReadQrFlowView,
        },
      ],
    },
    // Catch all 404
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/features/NotFoundView.vue"),
    },
  ],
});

export default router;
