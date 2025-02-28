export const formatPrice = (price: number): string => {
  // Convert to number to remove leading zeros, then format with commas
  return Number(price).toLocaleString();
};