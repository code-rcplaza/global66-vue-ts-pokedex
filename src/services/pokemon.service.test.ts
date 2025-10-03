import {
  fetchPokemonDetail,
  fetchPokemonList,
} from "@/services/pokemon.service";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Global fetch mock
global.fetch = vi.fn();

describe("pokemon.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchPokemonList", () => {
    it("should return Ok with a list of pokemons", async () => {
      const mockResponse = {
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
        ],
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchPokemonList(20, 0);

      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toHaveLength(2);
      expect(result.unwrap()[0]?.name).toBe("bulbasaur");
    });

    it("should return Err when the request fails", async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await fetchPokemonList(20, 0);

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().message).toContain("404");
    });

    it("should return Err when there is a network error", async () => {
      (fetch as any).mockRejectedValueOnce(new Error("Network error"));

      const result = await fetchPokemonList(20, 0);

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().message).toBe("Network error");
    });

    it("should use the correct limit and offset", async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] }),
      });

      await fetchPokemonList(10, 20);

      expect(fetch).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon?limit=10&offset=20"
      );
    });
  });

  describe("fetchPokemonDetail", () => {
    it("should return Ok with mapped pokemon data", async () => {
      const mockResponse = {
        id: 25,
        name: "pikachu",
        height: 4,
        weight: 60,
        types: [{ type: { name: "electric" } }],
        sprites: {
          other: {
            "official-artwork": {
              front_default: "https://example.com/pikachu.png",
            },
          },
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchPokemonDetail("pikachu");

      expect(result.isOk()).toBe(true);

      const pokemon = result.unwrap();
      expect(pokemon.id).toBe(25);
      expect(pokemon.name).toBe("pikachu");
      expect(pokemon.height).toBe(4);
      expect(pokemon.weight).toBe(60);
      expect(pokemon.types).toEqual(["electric"]);
      expect(pokemon.imageUrl).toBe("https://example.com/pikachu.png");
    });

    it("should correctly map multiple types", async () => {
      const mockResponse = {
        id: 6,
        name: "charizard",
        height: 17,
        weight: 905,
        types: [{ type: { name: "fire" } }, { type: { name: "flying" } }],
        sprites: {
          other: {
            "official-artwork": {
              front_default: "https://example.com/charizard.png",
            },
          },
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchPokemonDetail("charizard");
      const pokemon = result.unwrap();

      expect(pokemon.types).toEqual(["fire", "flying"]);
    });

    it("should return Err when the pokemon does not exist", async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await fetchPokemonDetail("fakemon");

      expect(result.isErr()).toBe(true);
    });

    it("should return Err when there is a network error", async () => {
      (fetch as any).mockRejectedValueOnce(new Error("Timeout"));

      const result = await fetchPokemonDetail("pikachu");

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().message).toBe("Timeout");
    });
  });
});
