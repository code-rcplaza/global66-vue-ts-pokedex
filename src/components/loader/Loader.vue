<template>
  <div class="loader">
    <img src="@/assets/pokeball.svg" alt="Loading..." class="loader__icon" />
  </div>
</template>

<style scoped>
.loader {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-lg);
  margin: 0;
  padding: 0;
  min-height: 100vh;
  z-index: 9999;
  background-color: var(--color-white);
}

.loader__icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
