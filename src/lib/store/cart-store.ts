import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, Coupon } from '@/types';
import { getActivePromotions } from '@/lib/config/promotions';

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  finalPrice: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  appliedCoupon: Coupon | null;
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
  applyCoupon: (coupon: Coupon) => boolean;
  removeCoupon: () => void;
}

/**
 * Detecta o tipo de camisa pelo NOME DO PRODUTO.
 * Ex: "Camisa Oversize / Akatsuki" → oversized
 *     "Camisa Tradicional / Pokémon" → tradicional
 */
function isOversized(item: CartItem): boolean {
  return item.name.toLowerCase().includes('oversize');
}

function isTradicional(item: CartItem): boolean {
  return item.name.toLowerCase().includes('tradicional');
}

/**
 * Calcula o preço final consultando a tabela verdade (promotions.ts).
 * Prioridade: promotional_price da API > promoção percentual ativa
 */
function calculateProductFinalPrice(product: Product): number {
  if (product.promotional_price && product.promotional_price < product.price) {
    return product.promotional_price;
  }

  const percentagePromo = product.applicable_promotions?.find(p => p.type === 'percentage');
  if (percentagePromo && percentagePromo.value) {
    return product.price * (1 - percentagePromo.value / 100);
  }

  // Fallback: consulta direta à tabela verdade
  // Garante consistência mesmo para itens do localStorage sem applicable_promotions atualizado
  const activePromos = getActivePromotions();
  const globalPercentagePromo = activePromos.find(
    p => p.type === 'percentage' && p.applies_to === 'all'
  );
  if (globalPercentagePromo && globalPercentagePromo.value) {
    return product.price * (1 - globalPercentagePromo.value / 100);
  }

  return product.price;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      appliedCoupon: null,

      addItem: (product, size) => {
        const { items } = get();
        const finalPrice = calculateProductFinalPrice(product);

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
              { ...product, quantity: 1, selectedSize: size, finalPrice },
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

      clearCart: () => set({ items: [], couponCode: null, appliedCoupon: null }),

      toggleCart: () => set({ isOpen: !get().isOpen }),

      getCartTotals: () => {
        const { items, appliedCoupon } = get();

        // Subtotal usa finalPrice (já com desconto percentual aplicado)
        const subtotal = items.reduce(
          (total, item) => total + item.finalPrice * item.quantity,
          0
        );

        // ✅ Consulta a tabela verdade
        const activePromotions = getActivePromotions();
        const buyXGetYPromo = activePromotions.find(p => p.type === 'buy_x_get_y');

        let promotionDiscount = 0;

        if (buyXGetYPromo) {
          const promoName = buyXGetYPromo.name.toLowerCase();
          const isOversizedTradicionaPromo =
            promoName.includes('oversize') || promoName.includes('tradicional');

          if (isOversizedTradicionaPromo) {
            // ✅ Detecta pelo nome do produto (ex: "Camisa Oversize / Akatsuki")
            const oversizedItems = items.filter(isOversized);
            const traditionalItems = items.filter(isTradicional);

            const oversizedCount = oversizedItems.reduce((acc, item) => acc + item.quantity, 0);
            const minQtyRequired = buyXGetYPromo.min_quantity || 2;
            const itemsToGiveFree = buyXGetYPromo.discount_quantity || 1;
            const freeCount = Math.floor(oversizedCount / minQtyRequired) * itemsToGiveFree;

            if (freeCount > 0 && traditionalItems.length > 0) {
              // Lista plana dos preços das tradicionais, do mais barato ao mais caro
              const allTraditionalPrices: number[] = [];
              traditionalItems.forEach(item => {
                for (let i = 0; i < item.quantity; i++) {
                  allTraditionalPrices.push(item.finalPrice);
                }
              });
              allTraditionalPrices.sort((a, b) => a - b);

              const maxFree = Math.min(freeCount, allTraditionalPrices.length);
              for (let i = 0; i < maxFree; i++) {
                promotionDiscount += allTraditionalPrices[i];
              }
            }
          } else {
            // Lógica genérica: Pague X Leve Y (ex: Pague 4 Leve 5)
            const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
            const minQty = buyXGetYPromo.min_quantity ?? 5;
            if (totalItems >= minQty) {
              const sortedByPrice = [...items].sort((a, b) => a.finalPrice - b.finalPrice);
              promotionDiscount = sortedByPrice[0]?.finalPrice ?? 0;
            }
          }
        }

        // Desconto de cupom
        let couponDiscount = 0;
        if (appliedCoupon) {
          const discountValue = parseFloat(appliedCoupon.value);
          if (appliedCoupon.type === 'percentage') {
            couponDiscount = subtotal * (discountValue / 100);
          } else if (appliedCoupon.type === 'absolute') {
            couponDiscount = discountValue;
          }
          couponDiscount = Math.min(couponDiscount, subtotal);
        }

        const totalDiscount = promotionDiscount + couponDiscount;
        const total = Math.max(0, subtotal - totalDiscount);

        return { subtotal, promotionDiscount, couponDiscount, totalDiscount, total };
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      applyCoupon: (coupon: Coupon) => {
        set({ couponCode: coupon.code.toUpperCase(), appliedCoupon: coupon });
        return true;
      },

      removeCoupon: () => {
        set({ couponCode: null, appliedCoupon: null });
      },
    }),
    {
      name: 'sentai-cart-storage-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);