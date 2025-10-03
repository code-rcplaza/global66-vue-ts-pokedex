<script setup lang="ts">
import StartIcon from "../icons/StartIcon.vue";

interface FavButtonProps {
  isFavorite: boolean;
  pokemonName: string;
}

interface FavButtonEmits {
  (e: "toggle"): void;
}

defineProps<FavButtonProps>();

const emit = defineEmits<FavButtonEmits>();
</script>

<template>
  <button
    class="favorite-button"
    @click.stop="emit('toggle')"
    :aria-label="`${isFavorite ? 'Remove' : 'Add'} ${pokemonName} ${
      isFavorite ? 'from' : 'to'
    } favorites`"
  >
    <StartIcon :color="isFavorite ? 'gold' : 'gray'" />
  </button>
</template>

<style lang="css" scoped>
.favorite-button {
  border: none;
  background-color: var(--color-fav-background);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  width: var(--size-fav-btn);
  height: var(--size-fav-btn);
  border-radius: var(--border-radius-rounded);
}

.favorite-button:hover {
  transform: scale(1.1);
}
</style>
