import { usePokemonSearch } from "@/composables/usePokemonSearch";
import * as pokemonService from "@/services/pokemon.service";
import { Err, Ok } from "oxide.ts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

vi.mock("@/services/pokemon.service");

vi.mock("@/composables/useLoader", () => ({
  useLoader: () => ({
    startLoading: vi.fn(),
    stopLoading: vi.fn(),
    loading: { value: false },
  }),
}));

describe("usePokemonSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe("loadPokemons", () => {
    it("should load pokemons correctly", async () => {
      const mockPokemons = [
        { name: "bulbasaur", url: "url1" },
        { name: "ivysaur", url: "url2" },
      ];

      vi.spyOn(pokemonService, "fetchPokemonList").mockResolvedValue(
        Ok(mockPokemons)
      );

      const { loadPokemons, pokemons } = usePokemonSearch();
      await loadPokemons();

      expect(pokemons.value).toHaveLength(2);
      expect(pokemons.value[0]?.name).toBe("bulbasaur");
    });

    it("should accumulate pokemons across multiple loads", async () => {
      const firstBatch = Array.from({ length: 20 }, (_, i) => ({
        name: `pokemon-${i}`,
        url: `url${i}`,
      }));

      const secondBatch = Array.from({ length: 20 }, (_, i) => ({
        name: `pokemon-${i + 20}`,
        url: `url${i + 20}`,
      }));

      vi.spyOn(pokemonService, "fetchPokemonList")
        .mockResolvedValueOnce(Ok(firstBatch))
        .mockResolvedValueOnce(Ok(secondBatch));

      const { loadPokemons, pokemons } = usePokemonSearch();

      await loadPokemons();
      expect(pokemons.value).toHaveLength(20);

      await loadPokemons();
      expect(pokemons.value).toHaveLength(40);
    });

    it("should not load if already loading", async () => {
      vi.spyOn(pokemonService, "fetchPokemonList").mockResolvedValue(
        Ok([{ name: "test", url: "url" }])
      );

      const { loadPokemons, loading } = usePokemonSearch();

      loading.value = true;
      await loadPokemons();

      expect(pokemonService.fetchPokemonList).not.toHaveBeenCalled();
    });

    it("should set hasMore to false if less than the limit is returned", async () => {
      vi.spyOn(pokemonService, "fetchPokemonList").mockResolvedValue(
        Ok([{ name: "test", url: "url" }])
      );

      const { loadPokemons, hasMore } = usePokemonSearch();
      await loadPokemons();

      expect(hasMore.value).toBe(false);
    });

    it("should set error when load fails", async () => {
      vi.spyOn(pokemonService, "fetchPokemonList").mockResolvedValue(
        Err(new Error("API Error"))
      );

      const { loadPokemons, error } = usePokemonSearch();
      await loadPokemons();

      expect(error.value).toBe("API Error");
    });
  });

  describe("filteredPokemons", () => {
    it("should return all if there is no searchQuery", async () => {
      vi.spyOn(pokemonService, "fetchPokemonList").mockResolvedValue(
        Ok([
          { name: "bulbasaur", url: "url1" },
          { name: "charmander", url: "url2" },
        ])
      );

      const { loadPokemons, filteredPokemons } = usePokemonSearch();
      await loadPokemons();

      expect(filteredPokemons.value).toHaveLength(2);
    });

    it("should filter by name correctly", async () => {
      vi.spyOn(pokemonService, "fetchPokemonList").mockResolvedValue(
        Ok([
          { name: "bulbasaur", url: "url1" },
          { name: "charmander", url: "url2" },
        ])
      );

      const { loadPokemons, filteredPokemons, searchQuery } =
        usePokemonSearch();
      await loadPokemons();

      searchQuery.value = "char";
      await nextTick();

      expect(filteredPokemons.value).toHaveLength(1);
      expect(filteredPokemons.value[0]?.name).toBe("charmander");
    });

    it("should filter case-insensitive", async () => {
      vi.spyOn(pokemonService, "fetchPokemonList").mockResolvedValue(
        Ok([{ name: "Pikachu", url: "url1" }])
      );

      const { loadPokemons, filteredPokemons, searchQuery } =
        usePokemonSearch();
      await loadPokemons();

      searchQuery.value = "PIKA";
      await nextTick();

      expect(filteredPokemons.value).toHaveLength(1);
    });
  });

  describe("empty", () => {
    it("should return true when there is a search with no results", async () => {
      vi.spyOn(pokemonService, "fetchPokemonList").mockResolvedValue(
        Ok([{ name: "bulbasaur", url: "url1" }])
      );

      const { loadPokemons, searchQuery, empty } = usePokemonSearch();
      await loadPokemons();

      searchQuery.value = "fakemon";
      await nextTick();

      expect(empty.value).toBe(true);
    });

    it("should return false when there is a search with results", async () => {
      vi.spyOn(pokemonService, "fetchPokemonList").mockResolvedValue(
        Ok([{ name: "pikachu", url: "url1" }])
      );

      const { loadPokemons, searchQuery, empty } = usePokemonSearch();
      await loadPokemons();

      searchQuery.value = "pika";
      await nextTick();

      expect(empty.value).toBe(false);
    });

    it("should return false when there is no search", async () => {
      const { empty } = usePokemonSearch();
      expect(empty.value).toBe(false);
    });
  });

  describe("handleSearch", () => {
    it("should update searchQuery", async () => {
      const { handleSearch, searchQuery } = usePokemonSearch();
      await handleSearch("pikachu");

      expect(searchQuery.value).toBe("pikachu");
    });

    it("should not fetch if exact match is found", async () => {
      vi.spyOn(pokemonService, "fetchPokemonList").mockResolvedValue(
        Ok([{ name: "pikachu", url: "url1" }])
      );

      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ name: "pikachu", id: 25 }),
      });
      global.fetch = fetchSpy;

      const { loadPokemons, handleSearch } = usePokemonSearch();
      await loadPokemons();

      await handleSearch("pikachu");

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("should fetch if only partial match exists", async () => {
      vi.spyOn(pokemonService, "fetchPokemonList").mockResolvedValue(
        Ok([{ name: "mewtwo", url: "url1" }])
      );

      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ name: "mew", id: 151 }),
      });
      global.fetch = fetchSpy;

      const { loadPokemons, handleSearch } = usePokemonSearch();
      await loadPokemons();

      await handleSearch("mew");

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon/mew"
      );
    });

    it("should fetch if no local match is found", async () => {
      vi.spyOn(pokemonService, "fetchPokemonList").mockResolvedValue(
        Ok([{ name: "bulbasaur", url: "url1" }])
      );

      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ name: "pikachu", id: 25 }),
      });
      global.fetch = fetchSpy;

      const { loadPokemons, handleSearch } = usePokemonSearch();
      await loadPokemons();

      await handleSearch("pikachu");

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon/pikachu"
      );
    });

    it("should handle 404 errors gracefully", async () => {
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });
      global.fetch = fetchSpy;

      const { handleSearch, error } = usePokemonSearch();
      await handleSearch("fakemon");

      expect(error.value).toBeNull();
    });

    it("should set error on network failure", async () => {
      const fetchSpy = vi.fn().mockRejectedValue(new Error("Network error"));
      global.fetch = fetchSpy;

      const { handleSearch, error } = usePokemonSearch();
      await handleSearch("pikachu");

      expect(error.value).toBe("Error searching pokemon");
    });
  });
});
