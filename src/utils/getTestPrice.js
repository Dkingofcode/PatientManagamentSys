// utils/getTestPrice.ts
export function getDiscountPercent(category) {
    const discounts = {
        "walk-in": 0,
        "referral": 10,
        "corporate": 15,
        "hmo": 30,
        "hospital": 20
    };
    return discounts[category] || 0;
}
export function getTestPrice(basePrice, category) {
    const discountPercent = getDiscountPercent(category);
    const discountAmount = (discountPercent / 100) * basePrice;
    const finalPrice = basePrice - discountAmount;
    return {
        finalPrice,
        discountPercent,
        discountAmount
    };
}
