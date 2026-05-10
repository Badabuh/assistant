export type Expense = {
  id: number;
  amount: number;
  category: string;
  note: string;
  date: string;
};

export type ExpenseInput = {
  amount: number;
  category: string;
  note: string;
  date: string;
};

export type ExpenseStats = {
  total: number;
  average: number;
  forecast7: number;
  forecast30: number;
};