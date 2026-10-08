import {
  addCalendarDays,
  countCalendarDays,
  getDaysInMonth,
} from '../../src/utils/calendar.js';

describe('calendar arithmetic', () => {
  test('counts month lengths for January and leap February', () => {
    expect(getDaysInMonth(1, 2024)).toBe(31);
    expect(getDaysInMonth(2, 2024)).toBe(29);
    expect(getDaysInMonth(2, 2023)).toBe(28);
  });

  test('adds and counts calendar days across a daylight saving transition', () => {
    const previousTimezone = process.env.TZ;
    process.env.TZ = 'America/New_York';
    try {
      const start = new Date(2024, 2, 9);
      const next = addCalendarDays(start, 1);
      const end = addCalendarDays(start, 2);

      expect(next.getDate()).toBe(10);
      expect(end.getDate()).toBe(11);
      expect(countCalendarDays(start, end)).toBe(3);
    } finally {
      if (previousTimezone === undefined) delete process.env.TZ;
      else process.env.TZ = previousTimezone;
    }
  });
});
