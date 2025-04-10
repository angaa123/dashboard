import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/home.vue";
import Page from "../pages/idopo.vue";
import Page2 from "../pages/page.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/pagr/:id/:cat_id", component: Page },
  { path: "/:cont_id", component: Page2 },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
