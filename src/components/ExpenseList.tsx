import css from "./App/App.module.css";
import { formatMoney } from "./App/utils";
import type { Expense } from "./App/types";

type ExpenseListProps = {
  expenses: Expense[];
  totalCount: number;
  onDeleteExpense: (expenseId: number) => void;
};

export function ExpenseList({
  expenses,
  totalCount,
  onDeleteExpense,
}: ExpenseListProps) {
  return (
    <section className={css.listCard}>
      <div className={css.cardHeader}>
        <h2>История трат</h2>
        <p>
          Показано {expenses.length} из {totalCount} операций.
        </p>
      </div>

      {expenses.length > 0 ? (
        <ul className={css.expenseList}>
          {expenses.map((expense) => (
            <li key={expense.id} className={css.expenseItem}>
              <div>
                <strong>{expense.category}</strong>
                <p>
                  {expense.date}
                  {expense.note ? ` · ${expense.note}` : ""}
                </p>
              </div>

              <div className={css.expenseActions}>
                <span>{formatMoney(expense.amount)}</span>
                <button
                  className={css.deleteButton}
                  type="button"
                  onClick={() => onDeleteExpense(expense.id)}
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={css.emptyState}>
          Пока нет расходов. Добавьте первую запись.
        </p>
      )}
    </section>
  );
}
