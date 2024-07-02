import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ServiceView from "@/views/ServiceView.vue";
import ServiceCreateView from "@/views/ServiceCreateView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/service/:id",
    name: "service",
    component: ServiceView,
  },
  {
    path: "/create",
    name: "create",
    component: ServiceCreateView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
