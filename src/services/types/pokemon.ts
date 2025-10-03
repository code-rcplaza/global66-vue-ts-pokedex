// API INTERFACES
export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface PokemonSprite {
  other: {
    "official-artwork": {
      front_default: string;
    };
  };
}

export interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  sprites: PokemonSprite;
}

// DOMAIN INTERFACES
export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  height: number;
  weight: number;
}
