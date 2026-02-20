import { Promotion } from "@/types";

/**
 * ⭐ CONFIGURAÇÃO MANUAL DE PROMOÇÕES
 * 
 * Como a API da Nuvemshop não expõe as promoções criadas no admin,
 * configure aqui as promoções ativas (ex: "Pague 4 Leve 5")
 * 
 * IDs DAS CATEGORIAS (para referência):
 * - Animes: 36162856
 *   - Dragon Ball: 36010922
 *   - Pokémon: 36010912
 *   - Naruto: 36010923
 *   - One Piece: 36010921
 *   - Kimetsu no Yaiba: 36010925
 *   - Hunter x Hunter: 36010924
 *   - Jujutsu Kaisen: 36331100
 *   - Fullmetal Alchemist: 36265066
 *   - Black Clover: 36431167
 * - Games: 36162539
 * - Tokusatsu: 36330613
 * - Comics: 36435833
 */
export const MANUAL_PROMOTIONS: Promotion[] = [
  {
    id: 1,
    name: "PAGUE 4 LEVE 5",
    type: "buy_x_get_y",
    enabled: true,
    start_date: "2026-01-14T00:00:00Z",
    end_date: "2026-02-28T23:59:59Z",
    applies_to: "all",
    min_quantity: 5,
    discount_quantity: 1
  },
  {
    id: 2,
    name: "Mês Dragon Ball - 10% OFF",
    type: "percentage",
    value: 10,
    enabled: true,
    start_date: "2026-01-30T00:00:00Z",
    end_date: "2026-02-28T23:59:59Z",
    applies_to: "categories",
    category_ids: [36010922]
  }
];

export function getActivePromotions(): Promotion[] {
  const now = new Date();
  
  return MANUAL_PROMOTIONS.filter(promo => {
    if (!promo.enabled) return false;
    
    const start = new Date(promo.start_date);
    const end = new Date(promo.end_date);
    
    return now >= start && now <= end;
  });
}