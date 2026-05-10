import css from "./App/App.module.css";
import { formatMoney } from "./App/utils";
import type { ExpenseStats } from "./App/types";

type ExpenseStatsGridProps = {
  stats: ExpenseStats;
};

export function ExpenseStatsGrid({ stats }: ExpenseStatsGridProps) {
  return (
    <div className={css.statsGrid}>
      <article className={css.statCard}>
        <span>Всего потрачено</span>
        <strong>{formatMoney(stats.total)}</strong>
      </article>
      <article className={css.statCard}>
        <span>Средний чек</span>
        <strong>{formatMoney(stats.average)}</strong>
      </article>
      <article className={css.statCard}>
        <span>Прогноз на 7 дней</span>
        <strong>{formatMoney(stats.forecast7)}</strong>
      </article>
      <article className={css.statCard}>
        <span>Прогноз на 30 дней</span>
        <strong>{formatMoney(stats.forecast30)}</strong>
      </article>
    </div>
  );
}
