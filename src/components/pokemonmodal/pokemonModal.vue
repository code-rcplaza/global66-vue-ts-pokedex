<script setup lang="ts">
import Background from "@/assets/background.svg";
import Close from "@/assets/close.svg";
import BaseButton from "@/components/button/Button.vue";
import FavButton from "@/components/favbutton/FavButton.vue";
import { fetchPokemonDetail } from "@/services/pokemon.service";
import type { Pokemon } from "@/services/types/pokemon";
import { usePokemonFavorites } from "@/stores/pokemonFavorites";
import { computed, onMounted, ref } from "vue";

interface Props {
  pokemonName: string;
}

interface Emits {
  (e: "close"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const favoritesStore = usePokemonFavorites();
const pokemonDetail = ref<Pokemon | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const isFavorite = computed(() =>
  pokemonDetail.value
    ? favoritesStore.isFavorite(pokemonDetail.value.name)
    : false
);

const getPokemonDetail = async () => {
  loading.value = true;
  error.value = null;

  const result = await fetchPokemonDetail(props.pokemonName);

  if (result.isErr()) {
    error.value = result.unwrapErr().message;
    loading.value = false;
    return;
  }

  pokemonDetail.value = result.unwrap();
  loading.value = false;
};

const handleShare = () => {
  if (!pokemonDetail.value) return;

  const text = `${pokemonDetail.value.name}, ${pokemonDetail.value.weight}, ${
    pokemonDetail.value.height
  }, ${pokemonDetail.value.types.join(", ")}`;

  navigator.clipboard.writeText(text);
};

const toggleFavorite = () => {
  if (!pokemonDetail.value) return;
  favoritesStore.toggleFavorite(pokemonDetail.value.name);
};

onMounted(getPokemonDetail);
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="modal">
      <button class="modal__close" @click="emit('close')">
        <img :src="Close" />
      </button>

      <div v-if="loading" class="modal__loading">Loading...</div>

      <div v-else-if="error" class="modal__error">{{ error }}</div>

      <div v-else-if="pokemonDetail" class="modal__content">
        <div class="pokemon__image-container">
          <img class="pokemon__background" :src="Background" alt="background" />
          <img
            class="pokemon__image"
            :src="pokemonDetail.imageUrl"
            :alt="pokemonDetail.name"
          />
        </div>

        <div class="pokemon__details">
          <p class="pokemon__detail-item">
            <span class="pokemon__label">Name:</span>
            <span class="pokemon__value">{{ pokemonDetail.name }}</span>
          </p>
          <p class="pokemon__detail-item">
            <span class="pokemon__label">Weight:</span>
            <span class="pokemon__value">{{ pokemonDetail.weight }}</span>
          </p>
          <p class="pokemon__detail-item">
            <span class="pokemon__label">Height:</span>
            <span class="pokemon__value">{{ pokemonDetail.height }}</span>
          </p>
          <p class="pokemon__detail-item">
            <span class="pokemon__label">Types:</span>
            <span class="pokemon__value">{{
              pokemonDetail.types.join(", ")
            }}</span>
          </p>
        </div>

        <div class="pokemon__actions">
          <BaseButton variant="primary" @click="handleShare">
            <template #label>Share to my friends</template>
          </BaseButton>

          <FavButton
            :is-favorite="isFavorite"
            :pokemon-name="pokemonDetail.name"
            @toggle="toggleFavorite"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background: var(--color-white, #fff);
  border-radius: 16px;
  overflow: hidden;
  min-width: 320px;
  max-width: 480px;
  width: 90%;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal__close {
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  background-color: transparent;
}

.modal__close:hover {
  transform: scale(1.1);
}

.modal__loading,
.modal__error {
  padding: 40px 20px;
  text-align: center;
  font-size: 16px;
}

.modal__error {
  color: var(--color-btn-default);
  font-weight: 600;
}

.modal__content {
  display: flex;
  flex-direction: column;
}

.pokemon__image-container {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.pokemon__background {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pokemon__image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
  object-fit: contain;
}

.pokemon__details {
  padding: 24px;
  background: var(--color-white, #fff);
}

.pokemon__detail-item {
  display: flex;
  justify-content: start;
  gap: var(--space-xxs);
  padding: var(--space-xxs) 0;
  border-bottom: 1px solid var(--color-text-tertiary);
  margin: 0;
}

.pokemon__detail-item:last-child {
  border-bottom: none;
}

.pokemon__label {
  font-weight: var(--font-weight-bold);
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  line-height: 150%;
}

.pokemon__value {
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  line-height: 150%;
  text-transform: capitalize;
}

.pokemon__actions {
  display: flex;
  align-items: center;
  gap: var(--space-xxs);
  padding: 0 var(--space-xs) var(--space-xs);
  justify-content: space-evenly;
}
</style>
