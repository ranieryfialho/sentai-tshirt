import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types';

interface FavoritesState {
  favorites: Product[];
  isOpen: boolean; // ⭐ ADICIONAR
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  toggleFavorite: (product: Product) => void; // ⭐ ADICIONAR
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
  toggleSheet: () => void; // ⭐ ADICIONAR
  getFavoritesCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isOpen: false, // ⭐ ADICIONAR

      // Adicionar aos favoritos
      addFavorite: (product) => {
        const { favorites } = get();
        const exists = favorites.find((item) => item.id === product.id);
        
        if (!exists) {
          set({ favorites: [...favorites, product] });
        }
      },

      // Remover dos favoritos
      removeFavorite: (productId) => {
        set({
          favorites: get().favorites.filter((item) => item.id !== productId),
        });
      },

      // ⭐ TOGGLE FAVORITO (adiciona ou remove)
      toggleFavorite: (product) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(product.id)) {
          removeFavorite(product.id);
        } else {
          addFavorite(product);
        }
      },

      // Verificar se é favorito
      isFavorite: (productId) => {
        return get().favorites.some((item) => item.id === productId);
      },

      // Limpar favoritos
      clearFavorites: () => set({ favorites: [] }),

      // ⭐ TOGGLE DO SHEET (abrir/fechar)
      toggleSheet: () => set({ isOpen: !get().isOpen }),

      // Contar favoritos
      getFavoritesCount: () => get().favorites.length,
    }),
    {
      name: 'sentai-favorites-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);