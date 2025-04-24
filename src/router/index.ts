import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/home.vue";
import List from "../pages/list.vue";
import Page from "../pages/page.vue";
import Taniltsulaga from "../pages/taniltsulaga.vue";
const routes = [
  { path: "/", component: Home },
  { path: "/list/:titel_id/:list_id", component: List },
  { path: "/:titel_id/:cont_id", component: Page },
  { path: "/page/:titel_id/:cont_id", component: Taniltsulaga },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
