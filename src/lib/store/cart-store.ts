import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types';

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  finalPrice: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  addItem: (product: Product, size: string) => void;
  removeItem: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getCartTotals: () => {
    subtotal: number;
    promotionDiscount: number;
    couponDiscount: number;
    totalDiscount: number;
    total: number;
  };
  getCartCount: () => number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

function calculateProductFinalPrice(product: Product): number {
  if (product.promotional_price && product.promotional_price < product.price) {
    return product.promotional_price;
  }
  
  const percentagePromo = product.applicable_promotions?.find(p => p.type === 'percentage');
  if (percentagePromo && percentagePromo.value) {
    return product.price * (1 - percentagePromo.value / 100);
  }
  
  return product.price;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,

      addItem: (product, size) => {
        const { items } = get();
        
        const finalPrice = calculateProductFinalPrice(product);
        
        console.log(`🛒 Adicionando ao carrinho: ${product.name}`);
        console.log(`   Preço original: R$ ${product.price.toFixed(2)}`);
        console.log(`   Preço final: R$ ${finalPrice.toFixed(2)}`);
        
        const existingItem = items.find(
          (item) => item.id === product.id && item.selectedSize === size
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id && item.selectedSize === size
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [
              ...items, 
              { 
                ...product, 
                quantity: 1, 
                selectedSize: size,
                finalPrice: finalPrice
              }
            ],
            isOpen: true,
          });
        }
      },

      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === productId && item.selectedSize === size)
          ),
        });
      },

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

      clearCart: () => set({ items: [], couponCode: null }),

      toggleCart: () => set({ isOpen: !get().isOpen }),

      getCartTotals: () => {
        const { items, couponCode } = get();
        
        const subtotal = items.reduce((total, item) => {
          return total + (item.finalPrice * item.quantity);
        }, 0);

        let promotionDiscount = 0;
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems >= 5) {
          const sortedItems = [...items].sort((a, b) => a.finalPrice - b.finalPrice);
          const cheapestItem = sortedItems[0];
          if (cheapestItem) {
            promotionDiscount = cheapestItem.finalPrice;
          }
        }

        let couponDiscount = 0;
        if (couponCode) {
          if (couponCode === 'COMPRА10' || couponCode === 'GRANDÃO10') {
            couponDiscount = subtotal * 0.10;
          }
        }

        const totalDiscount = promotionDiscount + couponDiscount;
        const total = Math.max(0, subtotal - totalDiscount);

        return {
          subtotal,
          promotionDiscount,
          couponDiscount,
          totalDiscount,
          total
        };
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      applyCoupon: (code) => {
        set({ couponCode: code.toUpperCase() });
        return true;
      },

      removeCoupon: () => {
        set({ couponCode: null });
      },
    }),
    {
      name: 'sentai-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);