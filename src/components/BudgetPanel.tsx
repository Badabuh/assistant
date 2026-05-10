import { useEffect, useMemo, useState, type FormEvent } from "react";
import css from "./App/App.module.css";

type BudgetPanelProps = {
  budget: number | null;
  monthSpent: number;
  onBudgetChange: (budget: number | null) => void;
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function BudgetPanel({
  budget,
  monthSpent,
  onBudgetChange,
}: BudgetPanelProps) {
  const [draftBudget, setDraftBudget] = useState(budget?.toString() ?? "");

  useEffect(() => {
    setDraftBudget(budget?.toString() ?? "");
  }, [budget]);

  const progress = useMemo(() => {
    if (!budget || budget <= 0) {
      return 0;
    }

    return Math.min(100, (monthSpent / budget) * 100);
  }, [budget, monthSpent]);

  const isOverBudget = budget !== null && monthSpent > budget;
  const remaining = budget === null ? null : budget - monthSpent;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draftBudget.trim()) {
      onBudgetChange(null);
      return;
    }

    const parsedBudget = Number(draftBudget.replace(",", "."));

    onBudgetChange(
      Number.isFinite(parsedBudget) && parsedBudget > 0 ? parsedBudget : null,
    );
  }

  return (
    <section className={css.budgetCard}>
      <div className={css.cardHeader}>
        <h2>Месячный бюджет</h2>
        <p>Отслеживайте лимит и предупреждение о перерасходе.</p>
      </div>

      <form className={css.budgetForm} onSubmit={handleSubmit}>
        <label className={css.field}>
          <span>Лимит на месяц</span>
          <input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="Например, 50000"
            value={draftBudget}
            onChange={(event) => setDraftBudget(event.target.value)}
          />
        </label>

        <div className={css.budgetActions}>
          <button className={css.primaryButton} type="submit">
            Сохранить лимит
          </button>
          <button
            className={css.secondaryButton}
            type="button"
            onClick={() => {
              setDraftBudget("");
              onBudgetChange(null);
            }}
          >
            Сбросить
          </button>
        </div>
      </form>

      <div className={css.budgetSummary}>
        <div className={css.budgetRow}>
          <span>Потрачено за месяц</span>
          <strong>{formatMoney(monthSpent)}</strong>
        </div>

        {budget !== null ? (
          <>
            <div className={css.budgetRow}>
              <span>Остаток</span>
              <strong className={isOverBudget ? css.warningText : undefined}>
                {formatMoney(Math.abs(remaining ?? 0))}
              </strong>
            </div>

            <div className={css.progressTrack} aria-hidden="true">
              <div
                className={
                  isOverBudget ? css.progressFillDanger : css.progressFill
                }
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className={isOverBudget ? css.warningBanner : css.hintText}>
              {isOverBudget
                ? `Лимит превышен на ${formatMoney(monthSpent - budget)}.`
                : `Использовано ${progress.toFixed(0)}% лимита.`}
            </p>
          </>
        ) : (
          <p className={css.hintText}>
            Лимит не задан. Установите сумму, чтобы видеть предупреждение о
            перерасходе.
          </p>
        )}
      </div>
    </section>
  );
}
