// Composables
import { createRouter, createWebHistory } from "vue-router";
//createWebHashHistory

import middlewarePipeline from "./middlewarePipeline";
import store from "../store";
import axios from "axios";
import auth from "./middleware/auth";

const routes = [
  {
    path: "/",
    component: () => import("../views/MainPage.vue"),
  },
  {
    path: "/certificate-main",
    name: "Certificate-Main",
    component: () => import("../views/MainPage.vue"),
    meta: {
      middleware: [auth],
    },
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
  //createWebHashHistory
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  //console.log(to.meta.middleware)
  if (!to.meta.middleware) {
    return next();
  }
  const middleware = to.meta.middleware;
  const context = {
    to,
    from,
    next,
    store,
    axios,
  };
  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1),
  });
});

export default router;
