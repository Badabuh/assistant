import type { Expense, ExpenseStats } from "./types";

function getDayKey(date: string) {
  return date.slice(0, 10);
}

function countDaysBetween(startDate: string, endDate: string) {
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
    return 1;
  }

  return Math.max(
    1,
    Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24)) + 1,
  );
}

export function calculateExpenseStats(expenses: Expense[]): ExpenseStats {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const average = expenses.length > 0 ? total / expenses.length : 0;

  if (expenses.length === 0) {
    return {
      total,
      average,
      forecast7: 0,
      forecast30: 0,
    };
  }

  const orderedDates = expenses
    .map((expense) => getDayKey(expense.date))
    .sort();
  const firstDate = orderedDates[0];
  const lastDate = orderedDates[orderedDates.length - 1];
  const trackedDays = countDaysBetween(firstDate, lastDate);
  const dailySpend = total / trackedDays;

  return {
    total,
    average,
    forecast7: dailySpend * 7,
    forecast30: dailySpend * 30,
  };
}
