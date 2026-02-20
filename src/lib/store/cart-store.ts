import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types';

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

interface CartTotals {
  rawSubtotal: number;
  subtotal: number;
  categoryDiscountTotal: number;
  promotionDiscount: number;
  couponDiscount: number;
  totalDiscount: number;
  total: number;
}

export type PromoType = 'BUY_X_GET_Y' | 'CATEGORY_PERCENTAGE';

export interface PromotionRule {
  id: string;
  name: string;
  active: boolean;
  type: PromoType;
  requiredQuantity?: number;
  freeQuantity?: number;
  targetCategory?: string; 
  discountPercentage?: number; 
}

export const STORE_PROMOTIONS: PromotionRule[] = [
  {
    id: 'pague4-leve5',
    name: 'Pague 4 Leve 5',
    active: true,
    type: 'BUY_X_GET_Y',
    requiredQuantity: 5,
    freeQuantity: 1
  },
  {
    id: 'mes-dragon-ball',
    name: 'Mês Dragon Ball',
    active: true,
    type: 'CATEGORY_PERCENTAGE',
    targetCategory: 'Dragon Ball',
    discountPercentage: 10
  }
];


export function getCalculatedProductPrice(product: any, promotions = STORE_PROMOTIONS) {
  const price = product.price || 0;
  let promotional_price = product.promotional_price || null;

  const activeRules = promotions.filter(p => p.active && p.type === 'CATEGORY_PERCENTAGE');

  activeRules.forEach(rule => {
    if (!rule.targetCategory || !rule.discountPercentage) return;

    const categoryStr = String(product.category || "").toLowerCase();
    const nameStr = String(product.name || "").toLowerCase();
    const targetStr = rule.targetCategory.toLowerCase();

    if (categoryStr.includes(targetStr) || nameStr.includes(targetStr)) {
      const discountVal = price * (rule.discountPercentage / 100);
      const newPromo = price - discountVal;

      if (!promotional_price || newPromo < promotional_price) {
        promotional_price = newPromo;
      }
    }
  });

  return { price, promotional_price };
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  activePromotions: PromotionRule[];
  
  addItem: (product: Product, size: string) => void;
  removeItem: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  syncPromotions: (promos: PromotionRule[]) => void;
  
  getCartTotals: () => CartTotals;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      activePromotions: STORE_PROMOTIONS,

      addItem: (product, size) => {
        const { items } = get();
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
            items: [...items, { ...product, quantity: 1, selectedSize: size }],
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

      applyCoupon: (code) => {
        const upperCode = code.toUpperCase();
        if (upperCode === 'SENTAI10') {
          set({ couponCode: upperCode });
          return true;
        }
        return false; 
      },

      removeCoupon: () => set({ couponCode: null }),

      syncPromotions: (promos) => set({ activePromotions: promos }),

      getCartTotals: () => {
        const { items, couponCode, activePromotions } = get();
        
        let rawSubtotal = 0;
        let currentSubtotal = 0;
        let categoryDiscountTotal = 0; 
        let totalQuantity = 0;
        const allPrices: number[] = [];

        items.forEach(item => {
          const basePrice = item.price;
          rawSubtotal += basePrice * item.quantity;

          const { promotional_price } = getCalculatedProductPrice(item, activePromotions);
          const finalItemPrice = promotional_price || basePrice;

          categoryDiscountTotal += (basePrice - finalItemPrice) * item.quantity;
          currentSubtotal += finalItemPrice * item.quantity;
          totalQuantity += item.quantity;
          
          for (let i = 0; i < item.quantity; i++) {
            allPrices.push(finalItemPrice);
          }
        });

        let promotionDiscount = 0;
        const activeRules = activePromotions.filter(promo => promo.active);

        activeRules.forEach(promo => {
          if (promo.type === 'BUY_X_GET_Y' && promo.requiredQuantity && promo.freeQuantity) {
            if (totalQuantity >= promo.requiredQuantity) {
              allPrices.sort((a, b) => a - b); 
              const timesToApply = Math.floor(totalQuantity / promo.requiredQuantity);
              const itemsToDiscount = timesToApply * promo.freeQuantity;

              for (let i = 0; i < itemsToDiscount; i++) {
                if (allPrices[i]) promotionDiscount += allPrices[i];
              }
            }
          }
        });

        let couponDiscount = 0;
        if (couponCode === 'SENTAI10') {
          couponDiscount = (currentSubtotal - promotionDiscount) * 0.10;
        }

        const total = Math.max(0, currentSubtotal - promotionDiscount - couponDiscount);
        
        const totalDiscount = categoryDiscountTotal + promotionDiscount + couponDiscount;

        return { 
          rawSubtotal, 
          subtotal: currentSubtotal, 
          categoryDiscountTotal, 
          promotionDiscount, 
          couponDiscount, 
          totalDiscount, 
          total 
        };
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'sentai-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);