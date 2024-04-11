import { createRouter, createWebHistory } from "vue-router";
import StyleTransfer from "../views/StyleTransfer.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: StyleTransfer,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
export default router;
