import { useState, type FormEvent } from "react";
import css from "./App/App.module.css";
import { expenseCategories, today } from "./App/constants";
import type { ExpenseInput } from "./App/types";

type ExpenseFormProps = {
  onAddExpense: (expense: ExpenseInput) => void;
};

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(expenseCategories[0]);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(today);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount.replace(",", "."));

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Введите сумму больше нуля.");
      return;
    }

    onAddExpense({
      amount: parsedAmount,
      category: category.trim() || "Без категории",
      note: note.trim(),
      date,
    });

    setAmount("");
    setNote("");
    setDate(today);
    setError("");
  }

  return (
    <form className={css.formCard} onSubmit={handleSubmit}>
      <div className={css.cardHeader}>
        <h2>Добавить трату</h2>
        <p>Сумма, категория, дата и короткая заметка.</p>
      </div>

      <label className={css.field}>
        <span>Сумма</span>
        <input
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          placeholder="0"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </label>

      <label className={css.field}>
        <span>Категория</span>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {expenseCategories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className={css.field}>
        <span>Дата</span>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </label>

      <label className={css.field}>
        <span>Заметка</span>
        <input
          type="text"
          placeholder="Например, обед или покупки для дома"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </label>

      {error ? <p className={css.error}>{error}</p> : null}

      <button className={css.primaryButton} type="submit">
        Добавить расход
      </button>
    </form>
  );
}
