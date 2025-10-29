/**
 * @file formatters.js
 * @description Reusable formatting helpers for currency and dates. Centralizing formatting
 * ensures a consistent display across the application and simplifies live edits.
 */

/**
 * @function formatCurrency
 * @param {number} value - Numeric amount to format as USD.
 * @returns {string}
 */
export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);

/**
 * @function formatDateTime
 * @param {string|Date} value - ISO string or Date object to format.
 * @returns {string}
 */
export const formatDateTime = (value) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));

/**
 * @function formatRelativeTime
 * @param {string|Date} value - Target date to compare with the current moment.
 * @returns {string}
 */
export const formatRelativeTime = (value) => {
  const targetDate = new Date(value).getTime();
  const now = Date.now();
  const diffInMs = targetDate - now;

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const minutes = Math.round(diffInMs / (1000 * 60));
  if (Math.abs(minutes) < 60) {
    return formatter.format(minutes, 'minute');
  }

  const hours = Math.round(diffInMs / (1000 * 60 * 60));
  if (Math.abs(hours) < 24) {
    return formatter.format(hours, 'hour');
  }

  const days = Math.round(diffInMs / (1000 * 60 * 60 * 24));
  return formatter.format(days, 'day');
};
