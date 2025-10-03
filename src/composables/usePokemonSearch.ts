// usePokemonSearch.ts
import { BASE_URL, DEFAULT_LIMIT } from "@/constants";
import { fetchPokemonList } from "@/services/pokemon.service";
import type { PokemonListItem } from "@/services/types/pokemon";
import { computed, ref } from "vue";
import { useLoader } from "./useLoader";

// Removido: usamos DEFAULT_LIMIT de constants

// ✅ Función pura - DRY
const matchesQuery = (name: string, query: string): boolean => {
  return name.toLowerCase().includes(query.toLowerCase());
};

export const usePokemonSearch = () => {
  const pokemons = ref<PokemonListItem[]>([]);
  const error = ref<string | null>(null);
  const loading = ref(false);
  const searchQuery = ref("");
  const offset = ref(0);
  const hasMore = ref(true);
  const { startLoading, stopLoading } = useLoader();

  const filteredPokemons = computed(() => {
    if (!searchQuery.value) return pokemons.value;
    return pokemons.value.filter((p) =>
      matchesQuery(p.name, searchQuery.value)
    );
  });

  const empty = computed(
    () => searchQuery.value.length > 0 && filteredPokemons.value.length === 0
  );

  const loadPokemons = async () => {
    if (loading.value) return;
    if (!hasMore.value) return;

    loading.value = true;
    error.value = null;

    const result = await fetchPokemonList(DEFAULT_LIMIT, offset.value);

    if (result.isErr()) {
      error.value = result.unwrapErr().message;
      loading.value = false;
      return;
    }

    const newPokemons = result.unwrap();

    if (newPokemons.length < DEFAULT_LIMIT) {
      hasMore.value = false;
    }

    pokemons.value = [...pokemons.value, ...newPokemons];
    offset.value += DEFAULT_LIMIT;
    loading.value = false;
  };

  const handleSearch = async (query: string) => {
    searchQuery.value = query;
    error.value = null;

    if (!query) return;

    const localMatch = pokemons.value.some((p) => matchesQuery(p.name, query));
    if (localMatch) return;

    startLoading();

    try {
      const response = await fetch(`${BASE_URL}/${query.toLowerCase()}`);

      if (!response.ok) {
        stopLoading();
        return;
      }

      const data = await response.json();

      pokemons.value = [
        ...pokemons.value,
        {
          name: data.name,
          url: `${BASE_URL}/${data.id}`,
        },
      ];
    } catch {
      error.value = "Error searching pokemon";
    } finally {
      stopLoading();
    }
  };

  return {
    pokemons,
    error,
    loading,
    empty,
    searchQuery,
    filteredPokemons,
    loadPokemons,
    handleSearch,
    hasMore,
  };
};
