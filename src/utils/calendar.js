/**
 * Add calendar days in local time without mutating the input date.
 * @param {Date} date Starting local date.
 * @param {number} amount Number of calendar days to add.
 * @returns {Date} A new date with the offset applied.
 */
export function addCalendarDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

/**
 * Count calendar dates inclusively between two local dates.
 * @param {Date} start First date in the range.
 * @param {Date} end Last date in the range.
 * @returns {number} Number of calendar days, including both endpoints.
 */
export function countCalendarDays(start, end) {
  const startUtc = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endUtc - startUtc) / 86400000) + 1;
}

/**
 * Get the number of days in a 1-based calendar month.
 * @param {number} month Month number from 1 (January) through 12 (December).
 * @param {number} [year] Full year; defaults to the current local year.
 * @returns {number} Number of days in the requested month.
 */
export function getDaysInMonth(month, year) {
  const date = new Date();
  date.setFullYear(year ?? date.getFullYear(), month, 0);
  return date.getDate();
}
