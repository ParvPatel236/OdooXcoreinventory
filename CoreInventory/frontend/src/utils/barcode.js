/**
 * Barcode/QR Code Generation Utilities
 * Generates and manages product barcodes
 */

/**
 * Generate barcode from product SKU
 * Format: SKU-PRODUCTID (e.g., STL-001-prd_1)
 */
export const generateBarcode = (sku, productId) => {
  return `${sku}-${productId}`;
};

/**
 * Parse barcode to extract product info
 * Returns { sku, productId } or null if invalid
 */
export const parseBarcode = (barcode) => {
  if (!barcode || typeof barcode !== 'string') return null;
  
  const parts = barcode.split('-');
  if (parts.length < 3) return null;
  
  // Format: SKU-CODE-PRODUCTID
  const sku = `${parts[0]}-${parts[1]}`;
  const productId = parts[2];
  
  return { sku, productId };
};

/**
 * Generate QR code data URL using external service
 * Using qr-server.com for simplicity (no dependencies)
 */
export const generateQRCodeURL = (barcode, size = 200) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(barcode)}`;
};

/**
 * Generate barcode image URL using external service
 * Using barcode.tec-it.com for simplicity
 */
export const generateBarcodeImageURL = (barcode, format = 'code128') => {
  return `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(barcode)}&code=${format}&translate=no`;
};

/**
 * Validate barcode format
 */
export const isValidBarcode = (barcode) => {
  return barcode && typeof barcode === 'string' && barcode.length > 0;
};
