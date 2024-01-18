/**
 * Format a date string into a specific format
 * @param {date} dateString - The date string to format
 * @returns {string} - The formatted date string
 */
export function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  }
  

/**
 * Format a number into a currency format
 * @param {number} params - The number to format
 * @returns {string} - The formatted number
 */
export const currencyFormatter = (params) => {
    if (!params.value) return null;
    return `$${params.value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};
