import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/pokemon",
      name: "list",
      component: () => import("@/views/PokemonList.vue"),
    },
    {
      path: "/favorites",
      name: "favorites",
      component: () => import("@/views/PokemonFavorites.vue"),
    },
  ],
});
