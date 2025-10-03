<script setup lang="ts">
import Navbar from "@/components/navbar/Navbar.vue";
import PokemonItem from "@/components/pokemonitem/PokemonItem.vue";
import PokemonModal from "@/components/pokemonmodal/pokemonModal.vue";
import SearchBar from "@/components/searchbar/SearchBar.vue";
import { useLoader } from "@/composables/useLoader";
import { usePokemonFavorites } from "@/stores/pokemonFavorites";
import { computed, ref } from "vue";

const favoritesStore = usePokemonFavorites();
const { loading } = useLoader();
const selectedPokemon = ref<string | null>(null);
const searchQuery = ref("");

const openDetail = (name: string) => (selectedPokemon.value = name);
const closeDetail = () => (selectedPokemon.value = null);

const filteredFavorites = computed(() => {
  if (!searchQuery.value) return favoritesStore.favorites;
  return favoritesStore.favorites.filter((name) =>
    name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div
    v-if="loading && favoritesStore.favorites.length === 0"
    class="fullscreen-loader"
  >
    <Loader />
  </div>

  <Navbar />
  <main>
    <SearchBar v-model="searchQuery" class="mb-sm" />

    <!-- List -->
    <div class="pokemon-list">
      <PokemonItem
        v-for="name in filteredFavorites"
        :key="name"
        :pokemon="{ name, url: `https://pokeapi.co/api/v2/pokemon/${name}` }"
        :isFavorite="favoritesStore.isFavorite(name)"
        @toggle-fav="favoritesStore.toggleFavorite(name)"
        @open-detail="openDetail"
      />
    </div>

    <PokemonModal
      v-if="selectedPokemon"
      @close="closeDetail"
      :pokemonName="selectedPokemon"
    />
  </main>
</template>

<style scoped>
main {
  padding: var(--space-sm);
  background-color: var(--color-background);
  min-height: 100dvh;
}

.title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-sm);
  color: var(--color-text-primary);
}

.empty {
  text-align: center;
  color: var(--color-text-secondary);
  margin-top: var(--space-md);
}

.caption {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  max-width: 315px;
  text-align: center;
  margin: 0 auto;
}

.pokemon-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  scrollbar-width: none;
}

.mb-sm {
  margin-bottom: var(--space-sm);
}

.container::-webkit-scrollbar {
  display: none;
}
</style>
