import { defineStore } from "pinia";
import { ref } from "vue";

export const usePokemonFavorites = defineStore(
  "favorites",
  () => {
    const favorites = ref<string[]>([]);

    const isFavorite = (name: string) => favorites.value.includes(name);

    const addFavorite = (name: string) => {
      if (!isFavorite(name)) {
        favorites.value.push(name);
      }
    };

    const removeFavorite = (name: string) => {
      favorites.value = favorites.value.filter((f) => f !== name);
    };

    const toggleFavorite = (name: string) => {
      if (isFavorite(name)) {
        removeFavorite(name);
      } else {
        addFavorite(name);
      }
    };

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
