import React, { useState } from "react";
import { Image, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import PokemonRequests from "../services/PokemonRequests";

const color = {
  fire: "#FF6B35",
  water: "#4A90D9",
  grass: "#782e7a",
  electric: "#F7CC35",
  psychic: "#E8547A",
  ice: "#74CEC0",
  dragon: "#6F3FE8",
  dark: "#5A4E6E",
  fairy: "#F4A7C3",
  fighting: "#C75C3B",
  poison: "#9B5FC0",
  ground: "#C8A85A",
  flying: "#82A6E0",
  bug: "#a75bff",
  rock: "#9E9382",
  ghost: "#4F4887",
  steel: "#8FA8B8",
  normal: "#A0A0A0",
};

type PokemonData = {
  pokemon_name: string;
  pokemon_id: number;
  pokemon_image: string;
  description: string;
  types: string[];
};

export default function PokemonSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setPokemon(null);
    Keyboard.dismiss();

    try {
  const result = await PokemonRequests.fetchPokemonData(searchQuery);
  if (result) {
    setPokemon(result as PokemonData);
    setSearchQuery("");
  } else {
    setErrorMsg("Pokémon não encontrado. Verifique o nome ou número.");
  }
  setLoading(false); 
} catch (error) {
  setErrorMsg("Erro ao buscar o Pokémon. Tente novamente.");
  setLoading(false); 
}
  }

  const primaryType = pokemon?.types?.[0] ?? "normal";
  const primaryColor = color[primaryType as keyof typeof color] ?? "#A0A0A0";

  return (
    <View style={styles.container}>

    
      <View style={styles.header}>
        <Text style={styles.title}>PokéSearch</Text>
        <Text style={styles.subtitle}>Busque por nome ou número</Text>
      </View>

      
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Ex: pikachu ou 25"
          placeholderTextColor="#000000"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <Pressable
          style={({ pressed }) => [
            styles.searchBtn,
            pressed && styles.searchBtnPressed,
          ]}
          onPress={handleSearch}
        >
          <Text style={styles.searchBtnText}>🔍</Text>
        </Pressable>
      </View>

      {loading && (
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>Procurando Pokémon...</Text>
        </View>
      )}

      
      {errorMsg ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}> {errorMsg}</Text>
        </View>
      ) : null}

    
      {pokemon && !loading && (
        <View style={[styles.card, { borderTopColor: primaryColor }]}>

         
          <View style={[styles.cardHeader, { backgroundColor: primaryColor + "22" }]}>
            <View>
              <Text style={styles.pokemonName}>
                {pokemon.pokemon_name.charAt(0).toUpperCase() +
                  pokemon.pokemon_name.slice(1)}
              </Text>
              <Text style={styles.pokemonId}>
                #{String(pokemon.pokemon_id).padStart(4, "0")}
              </Text>
            </View>

            
            <View style={styles.typesCol}>
              {pokemon.types.map((type) => (
                <View
                  key={type}
                  style={[
                    styles.typeBadge,
                 { backgroundColor: color[type as keyof typeof color] ?? "#A0A0A0" }
                  ]}
                >
                  <Text style={styles.typeBadgeText}>{type.toUpperCase()}</Text>
                </View>
              ))}
            </View>
          </View>

         
          <View style={[styles.imageBox, { backgroundColor: primaryColor + "15" }]}>
            <Image
              source={{ uri: pokemon.pokemon_image }}
              style={styles.pokemonImage}
              resizeMode="contain"
            />
          </View>

          {pokemon.description ? (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionLabel}>Descrição</Text>
              <Text style={styles.descriptionText}>{pokemon.description}</Text>
            </View>
          ) : null}
        </View>
      )}

      {!pokemon && !loading && !errorMsg && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎮</Text>
          <Text style={styles.emptyText}>
            Digite o nome ou número de um Pokémon para começar!
          </Text>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#917787",
    padding: 20,
    paddingTop: 60,     
  },

  
  header: {
    alignItems: "center",
    marginBottom: 28,
    marginTop: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#000000",
    marginTop: 4,
  },


  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#af869f",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000000",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchBtn: {
    backgroundColor: "#6e1d56",
    borderRadius: 16,
    width: 52,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  searchBtnPressed: {
    opacity: 0.8,
  },
  searchBtnText: {
    fontSize: 20,
  },

  
  loadingBox: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    color: "#000000",
    fontSize: 15,
  },


  errorBox: {
    backgroundColor: "#FFF3F2",
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#E3350D",
    marginBottom: 16,
  },
  errorText: {
    color: "#C0392B",
    fontSize: 14,
    fontWeight: "500",
  },

 
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderTopWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  pokemonName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  pokemonId: {
    fontSize: 14,
    color: "#9E9E9E",
    fontWeight: "600",
    marginTop: 2,
  },
  typesCol: {
    alignItems: "flex-end",
    gap: 6,
  },
  typeBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  typeBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },


  imageBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    minHeight: 160,
  },
  pokemonImage: {
    width: 140,
    height: 140,
  },

  
  descriptionBox: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  descriptionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9E9E9E",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: "#414141",
    lineHeight: 22,
  },

 
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    color: "#000000",
    textAlign: "center",
    lineHeight: 22,
  },
});