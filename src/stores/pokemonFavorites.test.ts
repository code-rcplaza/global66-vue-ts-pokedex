import { usePokemonFavorites } from "@/stores/pokemonFavorites";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

describe("usePokemonFavorites", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should start with an empty array", () => {
    const store = usePokemonFavorites();
    expect(store.favorites).toEqual([]);
  });

  it("should return false in isFavorite if the pokemon does not exist", () => {
    const store = usePokemonFavorites();
    expect(store.isFavorite("pikachu")).toBe(false);
  });

  it("should add a pokemon with addFavorite", () => {
    const store = usePokemonFavorites();
    store.addFavorite("pikachu");

    expect(store.favorites).toContain("pikachu");
    expect(store.favorites.length).toBe(1);
  });

  it("should not add duplicates with addFavorite", () => {
    const store = usePokemonFavorites();
    store.addFavorite("pikachu");
    store.addFavorite("pikachu");

    expect(store.favorites.length).toBe(1);
  });

  it("should return true in isFavorite if the pokemon exists", () => {
    const store = usePokemonFavorites();
    store.addFavorite("pikachu");

    expect(store.isFavorite("pikachu")).toBe(true);
  });

  it("should remove a pokemon with removeFavorite", () => {
    const store = usePokemonFavorites();
    store.addFavorite("pikachu");
    store.removeFavorite("pikachu");

    expect(store.favorites).not.toContain("pikachu");
    expect(store.favorites.length).toBe(0);
  });

  it("should add a pokemon with toggleFavorite if it does not exist", () => {
    const store = usePokemonFavorites();
    store.toggleFavorite("pikachu");

    expect(store.isFavorite("pikachu")).toBe(true);
  });

  it("should remove a pokemon with toggleFavorite if it exists", () => {
    const store = usePokemonFavorites();
    store.addFavorite("pikachu");
    store.toggleFavorite("pikachu");

    expect(store.isFavorite("pikachu")).toBe(false);
  });

  it("should handle multiple favorites", () => {
    const store = usePokemonFavorites();
    store.addFavorite("pikachu");
    store.addFavorite("charmander");
    store.addFavorite("squirtle");

    expect(store.favorites.length).toBe(3);
    expect(store.isFavorite("charmander")).toBe(true);
  });
});
