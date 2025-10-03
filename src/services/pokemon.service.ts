import { Err, Ok, type Result } from "oxide.ts";
import { BASE_URL, DEFAULT_LIMIT, DEFAULT_OFFSET } from "../constants";
import type {
  Pokemon,
  PokemonDetailResponse,
  PokemonListItem,
} from "./types/pokemon";

export const fetchPokemonList = async (
  limit = DEFAULT_LIMIT,
  offset = DEFAULT_OFFSET
): Promise<Result<PokemonListItem[], Error>> => {
  try {
    const url = `${BASE_URL}?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);

    if (!response.ok) {
      return Err(new Error(`HTTP error! status: ${response.status}`));
    }

    const data = await response.json();
    return Ok(data.results);
  } catch (error) {
    return Err(error instanceof Error ? error : new Error("Unknown error"));
  }
};

export const fetchPokemonDetail = async (
  pokemonName: string
): Promise<Result<Pokemon, Error>> => {
  try {
    const url = `${BASE_URL}/${pokemonName}`;
    const response = await fetch(url);

    if (!response.ok) {
      return Err(new Error(`HTTP error! status: ${response.status}`));
    }

    const data = (await response.json()) as PokemonDetailResponse;
    return Ok(mapToDomain(data));
  } catch (error) {
    return Err(error instanceof Error ? error : new Error("Unknown error"));
  }
};

const mapToDomain = (response: PokemonDetailResponse): Pokemon => ({
  id: response.id,
  name: response.name,
  imageUrl: response.sprites.other["official-artwork"].front_default,
  types: response.types.map((t) => t.type.name),
  height: response.height,
  weight: response.weight,
});
