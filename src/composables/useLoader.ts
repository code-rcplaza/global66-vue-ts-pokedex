import { onBeforeUnmount, ref } from "vue";

export const useLoader = (delay = 300) => {
  const loading = ref(false);
  let timer: number | null = null;

  const startLoading = () => {
    if (timer) clearTimeout(timer);

    timer = window.setTimeout(() => {
      loading.value = true;
    }, delay);
  };

  const stopLoading = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    loading.value = false;
  };

  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer);
  });

  return {
    loading,
    startLoading,
    stopLoading,
  };
};
