/**
 * Smart Stock Prediction Engine
 * Analyzes historical consumption patterns to predict stock shortages
 */

/**
 * Calculate average daily consumption from ledger entries
 * @param {Array} ledger - Stock ledger entries
 * @param {string} productId - Product ID to analyze
 * @param {number} daysBack - Number of days to look back (default: 30)
 * @returns {number} Average daily consumption
 */
export const calculateAverageDailyConsumption = (ledger, productId, daysBack = 30) => {
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

  const relevantEntries = ledger.filter((entry) => {
    if (entry.productId !== productId) return false;
    const entryDate = new Date(entry.date);
    return entryDate >= cutoffDate;
  });

  if (relevantEntries.length === 0) return 0;

  // Sum up all outgoing quantities (deliveries, transfers out, adjustments down)
  const totalConsumption = relevantEntries.reduce((sum, entry) => {
    // Negative qty means consumption (delivery, transfer out, adjustment down)
    if (entry.qty < 0) {
      return sum + Math.abs(entry.qty);
    }
    return sum;
  }, 0);

  // Calculate average per day
  const avgDaily = totalConsumption / daysBack;
  return Math.max(0, avgDaily);
};

/**
 * Predict days until stock runs out
 * @param {number} currentStock - Current stock quantity
 * @param {number} avgDailyConsumption - Average daily consumption
 * @param {number} minStock - Minimum stock threshold
 * @returns {number} Days until stock reaches minimum (or runs out if minStock is 0)
 */
export const predictDaysUntilStockout = (currentStock, avgDailyConsumption, minStock = 0) => {
  if (avgDailyConsumption <= 0) return Infinity; // No consumption pattern
  if (currentStock <= minStock) return 0; // Already at or below minimum

  const daysRemaining = (currentStock - minStock) / avgDailyConsumption;
  return Math.max(0, Math.round(daysRemaining * 10) / 10); // Round to 1 decimal
};

/**
 * Get stock prediction status
 * @param {number} daysRemaining - Days until stockout
 * @returns {string} Status: 'critical', 'warning', 'safe'
 */
export const getPredictionStatus = (daysRemaining) => {
  if (daysRemaining <= 3) return 'critical';
  if (daysRemaining <= 7) return 'warning';
  return 'safe';
};

/**
 * Get all product predictions
 * @param {Array} products - All products
 * @param {Object} stockMap - Current stock map
 * @param {Array} ledger - Stock ledger
 * @returns {Array} Array of predictions with product info
 */
export const getAllProductPredictions = (products, stockMap, ledger) => {
  return products
    .map((product) => {
      const totalStock = Object.entries(stockMap)
        .filter(([k]) => k.startsWith(`${product.id}_`))
        .reduce((sum, [, v]) => sum + v, 0);

      const avgConsumption = calculateAverageDailyConsumption(ledger, product.id);
      const daysRemaining = predictDaysUntilStockout(totalStock, avgConsumption, product.minStock);
      const status = getPredictionStatus(daysRemaining);

      return {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        currentStock: totalStock,
        minStock: product.minStock,
        avgDailyConsumption: Math.round(avgConsumption * 100) / 100,
        daysRemaining: daysRemaining === Infinity ? null : daysRemaining,
        status,
        isLowStock: totalStock <= product.minStock,
        isOutOfStock: totalStock <= 0,
      };
    })
    .sort((a, b) => {
      // Sort by urgency: critical first, then warning, then safe
      const statusOrder = { critical: 0, warning: 1, safe: 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      // Within same status, sort by days remaining (ascending)
      if (a.daysRemaining !== null && b.daysRemaining !== null) {
        return a.daysRemaining - b.daysRemaining;
      }
      return 0;
    });
};

/**
 * Get critical predictions (items that need immediate attention)
 * @param {Array} predictions - All predictions
 * @returns {Array} Predictions with critical or warning status
 */
export const getCriticalPredictions = (predictions) => {
  return predictions.filter((p) => p.status === 'critical' || p.status === 'warning');
};
