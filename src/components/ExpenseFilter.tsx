import css from "./App/App.module.css";

type ExpenseFilterProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export function ExpenseFilter({
  value,
  options,
  onChange,
}: ExpenseFilterProps) {
  return (
    <div className={css.filterBar}>
      <label className={css.field}>
        <span>Фильтр по категории</span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
