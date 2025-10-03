<script setup lang="ts">
import { copy } from "@/copy/en";
import { useDebounceFn } from "@vueuse/core";
import SearchIcon from "../icons/SearchIcon.vue";

interface SearchBarProps {
  modelValue: string;
  placeholder?: string;
}

interface SearchBarEmits {
  (e: "update:modelValue", value: string): void;
  (e: "search", query: string): void;
}

withDefaults(defineProps<SearchBarProps>(), {
  placeholder: copy.searchBar.search,
});

const emit = defineEmits<SearchBarEmits>();

const debouncedSearch = useDebounceFn((value: string) => {
  emit("search", value);
}, 1000);

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  emit("update:modelValue", value);
  debouncedSearch(value);
}
</script>

<template>
  <div class="search-bar">
    <SearchIcon class="search-bar__icon" />
    <input
      id="search-bar"
      :value="modelValue"
      @input="handleInput"
      type="text"
      :placeholder="placeholder"
      class="search-bar__input"
    />
  </div>
</template>

<style lang="css" scoped>
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-bar__icon {
  position: absolute;
  left: 1rem;
  pointer-events: none;
}

.search-bar__input {
  width: 100%;
  padding: var(--space-xxs) var(--space-xs) var(--space-xxs) var(--space-md);
  border: none;
  border-radius: 5px;
  background: var(--color-white);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  line-height: 140%;
}

.search-bar__input::placeholder {
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-regular);
}

.search-bar__input:focus {
  outline: none;
  box-shadow: 0 0 10px 2px var(--border-color-search);
}
</style>
