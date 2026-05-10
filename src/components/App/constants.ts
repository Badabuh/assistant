import type { Expense } from "./types";

export const expenseCategories = [
  "Продукты",
  "Транспорт",
  "Жильё",
  "Подписки",
  "Разное",
];

export const expensesStorageKey = "economic-expenses";
export const budgetStorageKey = "economic-monthly-budget";

export const today = new Date().toISOString().slice(0, 10);

export const initialExpenses: Expense[] = [
  {
    id: 1,
    amount: 1200,
    category: "Продукты",
    note: "Закупка на неделю",
    date: today,
  },
  {
    id: 2,
    amount: 450,
    category: "Транспорт",
    note: "Проезд и такси",
    date: today,
  },
];
