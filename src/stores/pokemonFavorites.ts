import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePokemonFavorites = defineStore(
  "favorites",
  () => {
    const favorites = ref<string[]>([]);

    const isFavorite = computed(() => {
      return (name: string) => favorites.value.includes(name);
    });

    function addFavorite(name: string) {
      if (!favorites.value.includes(name)) {
        favorites.value.push(name);
      }
    }

    function removeFavorite(name: string) {
      const index = favorites.value.indexOf(name);
      if (index > -1) {
        favorites.value.splice(index, 1);
      }
    }

    function toggleFavorite(name: string) {
      if (isFavorite.value(name)) {
        removeFavorite(name);
      } else {
        addFavorite(name);
      }
    }

    return {
      favorites,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
    };
  },
  {
    persist: true,
  }
);
