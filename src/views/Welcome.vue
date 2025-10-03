<script setup lang="ts">
import Button from "@/components/button/Button.vue";
import { copy } from "@/copy/en";
import { useRouter } from "vue-router";

const router = useRouter();

const goToPokemonList = (): void => {
  router.push({ name: "list" });
};
</script>

<template>
  <main class="main">
    <img class="logo" src="@/assets/pikachu.svg" alt="Pikachu" />

    <div class="view__text">
      <h1 class="title">{{ copy.welcome.title }}</h1>

      <p class="caption">{{ copy.welcome.caption }}</p>
    </div>
    <Button class="btn__start" @click="goToPokemonList">
      <template #label>
        <span>{{ copy.buttons.getStarted }}</span>
      </template>
    </Button>
  </main>
</template>

<style lang="css" scoped>
.main {
  align-items: center;
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  min-height: 100dvh;
  padding: var(--space-lg) var(--space-xs) var(--space-xs) var(--space-xs);
  width: 100%;
}

.view__text {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.caption {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  max-width: 315px;
  text-align: center;
}

@media screen and (min-width: 1024px) {
  .caption {
    max-width: 570px;
  }
}
</style>
