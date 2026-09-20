// src/utils/formatters.js

/**
 * Formats ISO timestamp to "02:14 AM · 12 OCT 2024"
 */
export function formatReceiptDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const day = date.toLocaleDateString('en-US', { day: '2-digit' });
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = date.getFullYear();
  return `${timeStr} · ${day} ${month} ${year}`;
}

/**
 * Formats ISO to compact date "12 Oct"
 */
export function formatShortDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Formats ISO to full date string "October 12, 2024"
 */
export function formatFullDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Formats currency values
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Formats duration in seconds to "3m 42s"
 */
export function formatDuration(seconds) {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}
