<script setup lang="ts">
import Button from "@/components/button/Button.vue";
import { copy } from "@/copy/en";
import { usePokemonFavorites } from "@/stores/pokemonFavorites";
import { useRoute } from "vue-router";
import ListIcon from "../icons/ListIcon.vue";
import StartIcon from "../icons/StartIcon.vue";

const route = useRoute();
const favoritesStore = usePokemonFavorites();
</script>

<template>
  <nav class="navbar">
    <!-- All Pokémon -->
    <RouterLink :to="{ name: 'list' }">
      <Button variant="toggle" :active="route.name === 'list'">
        <template #icon><ListIcon /></template>
        <template #label>{{ copy.buttons.all }}</template>
      </Button>
    </RouterLink>

    <!-- Favorites -->
    <RouterLink
      v-if="favoritesStore.favorites.length > 0"
      :to="{ name: 'favorites' }"
    >
      <Button variant="toggle" :active="route.name === 'favorites'">
        <template #icon><StartIcon color="white" /></template>
        <template #label>{{ copy.buttons.favorites }}</template>
      </Button>
    </RouterLink>

    <Button v-else variant="toggle" disabled>
      <template #icon><StartIcon color="white" /></template>
      <template #label>{{ copy.buttons.favorites }}</template>
    </Button>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xxs) var(--space-sm);
  background-color: var(--color-white);
  box-shadow: 0px -5px 4px rgba(0, 0, 0, 0.05);
}

.navbar > * {
  flex: 1;
  max-width: 275px;
}

.navbar .btn {
  width: 100%;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
