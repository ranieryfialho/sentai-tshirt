import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types';

// Definição do Item do Carrinho (Produto + Quantidade + Tamanho)
export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean; // Controle da gaveta lateral (Sheet)
  addItem: (product: Product, size: string) => void;
  removeItem: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // Adicionar Item
      addItem: (product, size) => {
        const { items } = get();
        // Verifica se já existe o mesmo produto com o mesmo tamanho
        const existingItem = items.find(
          (item) => item.id === product.id && item.selectedSize === size
        );

        if (existingItem) {
          // Se existe, apenas aumenta a quantidade
          set({
            items: items.map((item) =>
              item.id === product.id && item.selectedSize === size
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isOpen: true, // Abre o carrinho automaticamente
          });
        } else {
          // Se não, adiciona novo item
          set({
            items: [...items, { ...product, quantity: 1, selectedSize: size }],
            isOpen: true,
          });
        }
      },

      // Remover Item
      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === productId && item.selectedSize === size)
          ),
        });
      },

      // Atualizar Quantidade
      updateQuantity: (productId, size, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item.id === productId && item.selectedSize === size
              ? { ...item, quantity }
              : item
          ),
        });
      },

      // Limpar tudo
      clearCart: () => set({ items: [] }),

      // Abrir/Fechar Gaveta
      toggleCart: () => set({ isOpen: !get().isOpen }),

      // Helpers (Getters)
      getCartTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.promotional_price || item.price;
          return total + price * item.quantity;
        }, 0);
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'sentai-cart-storage', // Nome da chave no LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);