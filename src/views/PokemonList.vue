<script setup lang="ts">
import Loader from "@/components/loader/Loader.vue";
import Navbar from "@/components/navbar/Navbar.vue";
import PokemonItem from "@/components/pokemonitem/PokemonItem.vue";
import PokemonModal from "@/components/pokemonmodal/pokemonModal.vue";
import SearchBar from "@/components/searchbar/SearchBar.vue";
import { usePokemonSearch } from "@/composables/usePokemonSearch";
import { copy } from "@/copy/en";
import { usePokemonFavorites } from "@/stores/pokemonFavorites";
import { useInfiniteScroll } from "@vueuse/core";
import { onMounted, ref } from "vue";

const favoritesStore = usePokemonFavorites();
const {
  pokemons,
  error,
  loading,
  empty,
  searchQuery,
  filteredPokemons,
  loadPokemons,
  handleSearch,
  hasMore,
} = usePokemonSearch();

const selectedPokemon = ref<string | null>(null);

const openDetail = (name: string) => {
  selectedPokemon.value = name;
};

const closeDetail = () => (selectedPokemon.value = null);

onMounted(loadPokemons);

const scrollContainer = ref<HTMLElement | null>(null);

const loadMore = async () => {
  if (!hasMore.value || loading.value || searchQuery.value) return;
  await loadPokemons();
};

useInfiniteScroll(scrollContainer, loadMore, {
  distance: 50,
});
</script>

<template>
  <div v-if="loading && pokemons.length === 0" class="fullscreen-loader">
    <Loader />
  </div>

  <Navbar />

  <main>
    <SearchBar v-model="searchQuery" @search="handleSearch" class="mb-sm" />

    <div v-if="error" class="error">{{ error }}</div>

    <div v-else-if="empty" class="empty">
      <h1 class="title">{{ copy.error.title }}</h1>
      <p class="caption">{{ copy.error.caption }}</p>
    </div>

    <!-- ✅ Siempre renderiza el scroll container -->
    <div v-else ref="scrollContainer" class="scroll-container">
      <div class="pokemon-list">
        <PokemonItem
          v-for="pokemon in filteredPokemons"
          :key="pokemon.name"
          :pokemon="pokemon"
          :isFavorite="favoritesStore.isFavorite(pokemon.name)"
          @toggle-fav="favoritesStore.toggleFavorite(pokemon.name)"
          @open-detail="openDetail"
        />
      </div>

      <Loader v-if="loading && pokemons.length > 0" />

      <div v-if="!hasMore && !loading && !empty" class="end-list">
        All Pokémon loaded 🎉
      </div>
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
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-sm);
  color: var(--color-text-primary);
}

.error {
  color: var(--color-btn-default);
  font-weight: var(--font-weight-bold);
  text-align: center;
  margin-top: var(--space-sm);
}

.empty {
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  text-align: center;
  margin-top: var(--space-sm);
}

.caption {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  max-width: 315px;
  text-align: center;
  margin: 0 auto;
  line-height: 150%;
}

.scroll-container {
  height: 100vh;
  overflow-y: auto;
  margin-top: var(--space-sm);
  scrollbar-width: none;
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

.pokemon-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.mb-sm {
  margin-bottom: var(--space-sm);
}

.end-list {
  margin: var(--space-sm) 0;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.fullscreen-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--color-background);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
