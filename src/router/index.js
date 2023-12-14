// Composables
import { createRouter, createWebHistory } from "vue-router"; // for local
//import { createRouter, createWebHashHistory } from "vue-router"; // for server 

const routes = [
  {
    path: "/",
    component: () => import("../views/MainPage.vue"),
  },
  {
    path: "/certificate-main",
    name: "Certificate-Main",
    component: () => import("../views/MainPage.vue"),
  },
  {
    path: "/certificate-pdf",
    name: "Certificate-PDF",
    component: () => import("../views/Certificate-PDF.vue"),
  },
  {
    path: "/certificate-master",
    name: "Certificate-Master",
    component: () => import("../views/Certificate-Master.vue"),
  },
  {
    path: "/certificate-edit",
    name: "Certificate-Edit",
    component: () => import("../views/Certificate-Edit.vue"),
  },
  {
    path: "/show-pdf/:path",
    props: true,
    component: () => import("../views/Show-PDF.vue"),
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), // for local
  //history: createWebHashHistory(process.env.BASE_URL), // for server
  routes,
});


export default router;
