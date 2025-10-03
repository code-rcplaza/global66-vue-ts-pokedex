<script setup lang="ts">
import type { PokemonListItem } from "@/services/types/pokemon";
import FavButton from "../favbutton/FavButton.vue";

interface Props {
  pokemon: PokemonListItem;
  isFavorite: boolean;
}

interface Emits {
  (e: "toggle-fav"): void;
  (e: "open-detail", name: string): void;
}

defineProps<Props>();

const emit = defineEmits<Emits>();
</script>

<template>
  <article class="pokemon-item" @click="emit('open-detail', pokemon.name)">
    <span class="pokemon-item__name">{{ pokemon.name }}</span>

    <div class="pokemon-item__actions" @click.stop>
      <FavButton
        :isFavorite="isFavorite"
        :pokemonName="pokemon.name"
        @toggle="emit('toggle-fav')"
      />
    </div>
  </article>
</template>

<style scoped>
.pokemon-item {
  background-color: var(--color-white);
  border-radius: 5px;
  padding: var(--space-xxs) var(--space-xs);
  text-align: center;
  cursor: pointer;
  max-height: 60px;
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pokemon-item__name {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regualar);
  text-transform: capitalize;
}

.pokemon-item__actions {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
}
</style>
