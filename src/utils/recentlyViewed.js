// Utility functions for managing recently viewed products

const STORAGE_KEY = "recentlyViewed";
const MAX_ITEMS = 10;

/**
 * Add a product to recently viewed list
 * @param {Object} product - Product object to add
 */
export const addToRecentlyViewed = (product) => {
  try {
    const recent = getRecentlyViewed();

    // Remove if already exists (to move to front)
    const filtered = recent.filter((p) => p.id !== product.id);

    // Add to front and limit to MAX_ITEMS
    const updated = [
      {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        brand: product.brand,
        category: product.category,
        viewedAt: new Date().toISOString(),
      },
      ...filtered,
    ].slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Error adding to recently viewed:", error);
    return [];
  }
};

/**
 * Get all recently viewed products
 * @returns {Array} Array of recently viewed products
 */
export const getRecentlyViewed = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error getting recently viewed:", error);
    return [];
  }
};

/**
 * Clear all recently viewed products
 */
export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing recently viewed:", error);
  }
};

/**
 * Remove a specific product from recently viewed
 * @param {string} productId - ID of product to remove
 */
export const removeFromRecentlyViewed = (productId) => {
  try {
    const recent = getRecentlyViewed();
    const filtered = recent.filter((p) => p.id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error("Error removing from recently viewed:", error);
    return [];
  }
};
