// src/utils/calculateNextOccurrence.js

import dayjs from 'dayjs';

export const calculateNextOccurrence = (startDate, recurrence) => {
  let nextDate = dayjs(startDate);

  // Stop if end date is reached
  if (recurrence.endDate && dayjs(recurrence.endDate).isBefore(nextDate)) return null;

  switch (recurrence.type) {
    case 'daily':
      nextDate = nextDate.add(recurrence.interval, 'day');
      break;

    case 'weekly':
      if (recurrence.selectedDays && recurrence.selectedDays.length > 0) {
        const todayIndex = nextDate.day();
        const selectedDayIndexes = recurrence.selectedDays.map((day) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(day));
        const nextDayIndex = selectedDayIndexes.find((day) => day > todayIndex) || selectedDayIndexes[0];
        const daysToAdd = (nextDayIndex >= todayIndex ? nextDayIndex : nextDayIndex + 7) - todayIndex;
        nextDate = nextDate.add(daysToAdd, 'day');
      } else {
        nextDate = nextDate.add(recurrence.interval * 7, 'day');
      }
      break;

    case 'monthly':
      if (recurrence.nthDay) {
        const nthDayOfMonth = nextDate.date(recurrence.nthDay);
        if (nthDayOfMonth.isBefore(nextDate)) {
          nextDate = nextDate.add(1, 'month').date(recurrence.nthDay);
        } else {
          nextDate = nthDayOfMonth;
        }
      } else {
        nextDate = nextDate.add(recurrence.interval, 'month');
      }
      break;

    case 'yearly':
      nextDate = nextDate.add(recurrence.interval, 'year');
      break;

    default:
      return null;
  }

  // Check if the next occurrence is beyond the end date
  if (recurrence.endDate && nextDate.isAfter(dayjs(recurrence.endDate))) return null;

  return nextDate.format('DD/MM/YYYY');
};
