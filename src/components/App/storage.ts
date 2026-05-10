import type { Expense } from "./types";
import { budgetStorageKey, expensesStorageKey } from "./constants";

export function loadExpenses(fallback: Expense[]) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const storedValue = window.localStorage.getItem(expensesStorageKey);

  if (!storedValue) {
    return fallback;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as unknown;

    if (!Array.isArray(parsedValue)) {
      return fallback;
    }

    return parsedValue.filter((expense): expense is Expense => {
      if (typeof expense !== "object" || expense === null) {
        return false;
      }

      const candidate = expense as Record<string, unknown>;

      return (
        typeof candidate.id === "number" &&
        Number.isFinite(candidate.id) &&
        typeof candidate.amount === "number" &&
        Number.isFinite(candidate.amount) &&
        typeof candidate.category === "string" &&
        typeof candidate.note === "string" &&
        typeof candidate.date === "string"
      );
    });
  } catch {
    return fallback;
  }
}

export function saveExpenses(expenses: Expense[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(expensesStorageKey, JSON.stringify(expenses));
}

export function loadBudget(fallback: number | null) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const storedValue = window.localStorage.getItem(budgetStorageKey);

  if (!storedValue) {
    return fallback;
  }

  const parsedValue = Number(storedValue);

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
}

export function saveBudget(budget: number | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (budget === null) {
    window.localStorage.removeItem(budgetStorageKey);
    return;
  }

  window.localStorage.setItem(budgetStorageKey, String(budget));
}
