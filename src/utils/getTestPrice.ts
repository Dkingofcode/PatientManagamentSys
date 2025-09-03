// utils/getTestPrice.ts

export type PatientCategory = "walk-in" | "referral" | "corporate" | "hmo" | "hospital" ;

export function getDiscountPercent(category: PatientCategory): number {
  const discounts: Record<PatientCategory, number> = {
    "walk-in": 0,
    "referral": 10,
    "corporate": 15,
    "hmo": 30,
    "hospital": 20
  };
  return discounts[category] || 0;
}

export function getTestPrice(basePrice: number, category: PatientCategory): {
  finalPrice: number;
  discountPercent: number;
  discountAmount: number;
} {
  const discountPercent = getDiscountPercent(category);
  const discountAmount = (discountPercent / 100) * basePrice;
  const finalPrice = basePrice - discountAmount;

  return {
    finalPrice,
    discountPercent,
    discountAmount
  };
}


