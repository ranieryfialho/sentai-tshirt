import { Product, Promotion, Coupon } from "@/types";

export function calculateProductDiscount(product: Product): {
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
  applied_promotion: Promotion | null;
  applied_coupon: Coupon | null;
} {
  const originalPrice = product.price;
  let discountedPrice = originalPrice;
  let appliedPromotion: Promotion | null = null;
  let appliedCoupon: Coupon | null = null;

  if (product.promotional_price && product.promotional_price < originalPrice) {
    discountedPrice = product.promotional_price;
  }
  else if (product.applicable_promotions && product.applicable_promotions.length > 0) {
    const percentagePromo = product.applicable_promotions.find(p => p.type === 'percentage');
    if (percentagePromo && percentagePromo.value) {
      discountedPrice = originalPrice * (1 - percentagePromo.value / 100);
      appliedPromotion = percentagePromo;
    }
  }
  else if (product.applicable_coupons && product.applicable_coupons.length > 0) {
    const percentageCoupon = product.applicable_coupons.find(c => c.type === 'percentage');
    if (percentageCoupon) {
      const discountValue = parseFloat(percentageCoupon.value);
      discountedPrice = originalPrice * (1 - discountValue / 100);
      appliedCoupon = percentageCoupon;
    }
  }

  const discountPercentage = discountedPrice < originalPrice
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  return {
    original_price: originalPrice,
    discounted_price: discountedPrice,
    discount_percentage: discountPercentage,
    applied_promotion: appliedPromotion,
    applied_coupon: appliedCoupon
  };
}