<script setup lang="ts">
interface ButtonProps {
  active?: boolean;
  variant?: "primary" | "toggle";
  disabled?: boolean;
}

withDefaults(defineProps<ButtonProps>(), {
  active: false,
  variant: "primary",
  disabled: false,
});
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :class="[
      'btn',
      `btn--${variant}`,
      { 'is-active': active, 'is-disabled': disabled },
    ]"
  >
    <span v-if="$slots.icon" class="btn__icon">
      <slot name="icon" />
    </span>
    <span v-if="$slots.label" class="btn__label">
      <slot name="label" />
    </span>
  </button>
</template>

<style scoped>
.btn {
  font-family: "Lato", sans-serif;
  font-weight: var(--font-weight-bold);
  border: none;
  border-radius: var(--border-radius-pill);
  padding: var(--space-xxs) var(--space-xs);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xxs);
  transition: background-color 120ms ease, transform 80ms ease;
}

.btn--primary {
  background: var(--color-btn-default);
  color: var(--color-text-white);
}

.btn--toggle {
  background: var(--color-btn-inactive);
  color: var(--color-text-white);
}
.btn--toggle.is-active {
  background: var(--color-btn-default);
  color: var(--color-text-white);
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.15);
}

.btn:hover:not(.is-disabled) {
  filter: brightness(0.95);
}
.btn:active:not(.is-disabled) {
  transform: scale(0.98);
}
.btn.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn__label {
  font-size: var(--font-size-sm);
}
</style>
