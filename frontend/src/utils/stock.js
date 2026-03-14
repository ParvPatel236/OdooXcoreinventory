/**
 * Get total stock for a product across all locations.
 * stockMap: { [productId_locationId]: qty }
 */
export const getProductTotalStock = (productId, stockMap) => {
  return Object.entries(stockMap)
    .filter(([key]) => key.startsWith(`${productId}_`))
    .reduce((sum, [, qty]) => sum + qty, 0);
};

export const getStockStatus = (qty, minStock = 10) => {
  if (qty <= 0) return 'out';
  if (qty <= minStock) return 'low';
  return 'ok';
};
