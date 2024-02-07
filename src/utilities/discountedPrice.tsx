export function discountedPrice(price: number, promo: number | null) {
  if (!promo) {
    return price;
  }
  return price * (1 - promo / 100);
}
