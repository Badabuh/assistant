import { useEffect, useMemo, useState } from "react";
import css from "./App.module.css";
import { ExpenseForm } from "../ExpenseForm";
import { ExpenseFilter } from "../ExpenseFilter";
import { ExpenseList } from "../ExpenseList";
import { ExpenseStatsGrid } from "../ExpenseStatsGrid";
import { GeminiTips } from "../GeminiTips";
import { expenseCategories, initialExpenses } from "./constants";
import { calculateExpenseStats } from "./analytics";
import type { ExpenseInput } from "./types";
import { loadBudget, loadExpenses, saveBudget, saveExpenses } from "./storage";
import { BudgetPanel } from "../BudgetPanel";
import { today } from "./constants";

const allCategoriesOption = "Все категории";

function App() {
  const [expenses, setExpenses] = useState(() => loadExpenses(initialExpenses));
  const [selectedCategory, setSelectedCategory] = useState(allCategoriesOption);
  const [budget, setBudget] = useState<number | null>(() => loadBudget(null));

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    saveBudget(budget);
  }, [budget]);

  const stats = useMemo(() => calculateExpenseStats(expenses), [expenses]);

  const currentMonthKey = today.slice(0, 7);
  const currentMonthSpent = expenses.reduce((sum, expense) => {
    return expense.date.startsWith(currentMonthKey)
      ? sum + expense.amount
      : sum;
  }, 0);

  const visibleExpenses =
    selectedCategory === allCategoriesOption
      ? expenses
      : expenses.filter((expense) => expense.category === selectedCategory);

  const filterOptions = [allCategoriesOption, ...expenseCategories];

  function handleAddExpense(expense: ExpenseInput) {
    setExpenses((current) => [
      {
        id: Date.now(),
        ...expense,
      },
      ...current,
    ]);
  }

  function handleDeleteExpense(expenseId: number) {
    setExpenses((current) =>
      current.filter((expense) => expense.id !== expenseId),
    );
  }

  return (
    <main className={css.app}>
      <section className={css.hero}>
        <div className={css.heroSide}>
          <ExpenseStatsGrid stats={stats} />
          <BudgetPanel
            budget={budget}
            monthSpent={currentMonthSpent}
            onBudgetChange={setBudget}
          />
        </div>
      </section>

      <section className={css.contentGrid}>
        <ExpenseForm onAddExpense={handleAddExpense} />
        <section className={css.listStack}>
          <ExpenseFilter
            value={selectedCategory}
            options={filterOptions}
            onChange={setSelectedCategory}
          />
          <ExpenseList
            expenses={visibleExpenses}
            totalCount={expenses.length}
            onDeleteExpense={handleDeleteExpense}
          />
        </section>
      </section>

      <section className={css.geminiSection}>
        <GeminiTips
          expenses={visibleExpenses}
          stats={stats}
          budget={budget}
          monthSpent={currentMonthSpent}
        />
      </section>
    </main>
  );
}

export default App;
