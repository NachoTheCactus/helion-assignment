import { format } from 'date-fns';

/**
 * Formats a price by removing leading zeros and adding thousand separators
 * Uses RON currency
 * @param price - The price value to format
 * @returns Formatted price string
 */
export const formatPrice = (price: number | string): string => {
  // Convert to number to remove leading zeros, then format with commas
  return Number(price).toLocaleString();
};

/**
 * Formats a price with RON currency
 * @param price - The price value to format
 * @returns Formatted price string with RON
 */
export const formatPriceWithCurrency = (price: number | string): string => {
  return `${formatPrice(price)} RON`;
};

/**
 * Formats a date string to Romanian format (DD.MM.YYYY)
 * @param dateString - ISO date string to format
 * @returns Date formatted as DD.MM.YYYY
 */
export const formatDateRomanian = (dateString: string): string => {
  try {
    // Create a valid Date object from the input string
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    // Format as DD.MM.YYYY using date-fns
    return format(date, 'dd.MM.yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if parsing fails
  }
};

/**
 * Formats a date string for HTML date input fields (YYYY-MM-DD)
 * @param dateString - ISO date string to format
 * @returns Date formatted as YYYY-MM-DD
 */
export const formatDateForInput = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return dateString; // Return original string if parsing fails
  }
};