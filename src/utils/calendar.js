/** Calendar arithmetic that is independent of the local UTC offset. */
export function addCalendarDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function countCalendarDays(start, end) {
  const startUtc = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endUtc - startUtc) / 86400000) + 1;
}

export function getDaysInMonth(month, year) {
  const date = new Date();
  date.setFullYear(year ?? date.getFullYear(), month, 0);
  return date.getDate();
}
