import { Promotion } from "@/types";

/**
 * ⭐ CONFIGURAÇÃO MANUAL DE PROMOÇÕES — TABELA VERDADE
 *
 * Este arquivo é o único ponto de controle de promoções do sistema.
 * Todos os outros arquivos (client, cart-store, product-card, etc.) consultam aqui.
 *
 * Regras de ativação (todas devem ser verdadeiras):
 *   1. enabled: true          → liga/desliga manualmente
 *   2. start_date (opcional)  → se informada, promoção só vale após essa data
 *   3. end_date   (opcional)  → se informada, promoção expira nessa data automaticamente
 *
 * Tipos suportados:
 *   - "percentage"   → desconto percentual no preço unitário
 *   - "buy_x_get_y"  → compre X da categoria A, ganhe Y da categoria B de graça
 *
 * IDs DAS CATEGORIAS (para referência):
 * - Animes: 36162856
 *   - Dragon Ball: 36010922  | Pokémon: 36010912   | Naruto: 36010923
 *   - One Piece: 36010921    | Kimetsu: 36010925   | HxH: 36010924
 *   - Jujutsu Kaisen: 36331100 | FMA: 36265066     | Black Clover: 36431167
 * - Games: 36162539
 * - Tokusatsu: 36330613
 * - Comics: 36435833
 */
export const MANUAL_PROMOTIONS: Promotion[] = [
  {
    id: 1,
    name: "Mês do Consumidor - 10% OFF em Toda a Loja",
    type: "percentage",
    value: 10,
    enabled: true,
    start_date: "2026-03-01T00:00:00Z",
    end_date: "2026-03-31T23:59:59Z",
    applies_to: "all",
  },
  {
    id: 2,
    name: "Compre 2 Oversized, Leve 1 Tradicional",
    type: "buy_x_get_y",
    enabled: true,
    start_date: "2026-03-01T00:00:00Z",
    end_date: "2026-03-31T23:59:59Z",
    applies_to: "categories",
    category_ids: [],
    min_quantity: 2,
    discount_quantity: 1,
  },
];

export function getActivePromotions(): Promotion[] {
  const now = new Date();

  return MANUAL_PROMOTIONS.filter(promo => {
    if (!promo.enabled) return false;

    if (promo.start_date) {
      const start = new Date(promo.start_date);
      if (now < start) return false;
    }

    if (promo.end_date) {
      const end = new Date(promo.end_date);
      if (now > end) return false;
    }

    return true;
  });
}