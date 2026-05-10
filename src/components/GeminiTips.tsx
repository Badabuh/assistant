import { useMemo, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import css from "./App/App.module.css";
import type { Expense, ExpenseStats } from "./App/types";
import { loadGeminiApiKey } from "./App/geminiStorage";

type GeminiTipsProps = {
  expenses: Expense[];
  stats: ExpenseStats;
  budget: number | null;
  monthSpent: number;
};

type GeminiTip = {
  title: string;
  text: string;
};

type GeminiApiErrorPayload = {
  error?: {
    code?: number;
    message?: string;
    status?: string;
    details?: Array<{ retryDelay?: string }>;
  };
};

function formatGeminiError(caughtError: unknown) {
  const fallback =
    "Не удалось получить советы Gemini. Проверьте ключ и попробуйте ещё раз.";

  const detail = caughtError instanceof Error ? caughtError.message : "";

  try {
    const parsed = JSON.parse(detail) as GeminiApiErrorPayload;
    const code = parsed.error?.code;
    const status = parsed.error?.status;
    const message = parsed.error?.message ?? "";
    const retryDelay = parsed.error?.details?.find(
      (item) => item.retryDelay,
    )?.retryDelay;

    if (code === 429 || status === "RESOURCE_EXHAUSTED") {
      return retryDelay
        ? `Квота Gemini исчерпана. Повторите позже.`
        : "Квота Gemini исчерпана. Проверьте лимиты и биллинг в Google AI Studio.";
    }

    if (code === 400 || status === "INVALID_ARGUMENT") {
      return "Некорректный запрос к Gemini API. Проверьте формат данных.";
    }

    if (code === 401 || code === 403 || status === "PERMISSION_DENIED") {
      return "Ошибка доступа к Gemini API. Проверьте API key и ограничения ключа.";
    }

    if (message) {
      return `Gemini: ${message}`;
    }
  } catch {
    if (detail) {
      return `Gemini: ${detail}`;
    }
  }

  return fallback;
}

function buildPrompt(
  expenses: Expense[],
  stats: ExpenseStats,
  budget: number | null,
  monthSpent: number,
) {
  const recentExpenses = expenses.slice(0, 8).map((expense) => ({
    date: expense.date,
    category: expense.category,
    amount: expense.amount,
    note: expense.note,
  }));

  return [
    "Ты финансовый помощник. Ответь на русском языке.",
    "Дай 3 коротких и практичных совета по оптимизации расходов на основе данных ниже.",
    'Формат ответа строго JSON-массивом из 3 объектов вида {"title": string, "text": string}.',
    `Всего потрачено: ${stats.total.toFixed(2)}.`,
    `Средний чек: ${stats.average.toFixed(2)}.`,
    `Прогноз на 30 дней: ${stats.forecast30.toFixed(2)}.`,
    `Бюджет: ${budget === null ? "не задан" : budget.toFixed(2)}.`,
    `Потрачено за месяц: ${monthSpent.toFixed(2)}.`,
    `Последние траты: ${JSON.stringify(recentExpenses)}`,
  ].join("\n");
}

function parseGeminiTips(rawText: string) {
  const jsonMatch = rawText.match(/\[[\s\S]*\]/);
  const payload = jsonMatch ? jsonMatch[0] : rawText;

  const parsedValue = JSON.parse(payload) as unknown;

  if (!Array.isArray(parsedValue)) {
    throw new Error("Unexpected Gemini response");
  }

  return parsedValue
    .filter(
      (tip): tip is GeminiTip =>
        typeof tip === "object" &&
        tip !== null &&
        "title" in tip &&
        "text" in tip &&
        typeof tip.title === "string" &&
        typeof tip.text === "string",
    )
    .slice(0, 3);
}

export function GeminiTips({
  expenses,
  stats,
  budget,
  monthSpent,
}: GeminiTipsProps) {
  const apiKey = useMemo(() => loadGeminiApiKey().trim(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tips, setTips] = useState<GeminiTip[]>([]);

  const canAsk = useMemo(() => apiKey.length > 0, [apiKey]);

  async function handleAskAdvice() {
    if (!canAsk) {
      setError("Gemini API key не найден в .env.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: buildPrompt(expenses, stats, budget, monthSpent),
        config: {
          temperature: 0.4,
          maxOutputTokens: 512,
          responseMimeType: "application/json",
        },
      });

      const rawText = response.text ?? "";
      setTips(parseGeminiTips(rawText));
    } catch (caughtError) {
      const message = formatGeminiError(caughtError);
      setError(message);
      setTips([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={css.geminiCard}>
      <div className={css.cardHeader}>
        <h2>Советы Gemini</h2>
        <p>Нажмите кнопку, чтобы получить советы от Gemini.</p>
      </div>

      <div className={css.geminiForm}>
        <button
          className={css.secondaryButton}
          type="button"
          onClick={handleAskAdvice}
          disabled={loading || !canAsk}
        >
          {loading ? "Получаю совет..." : "Попросить совет"}
        </button>
      </div>

      {error ? <p className={css.error}>{error}</p> : null}

      {tips.length > 0 ? (
        <div className={css.geminiTips}>
          {tips.map((tip) => (
            <article key={tip.title} className={css.geminiTip}>
              <h3>{tip.title}</h3>
              <p>{tip.text}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className={css.hintText}>
          Пока нет советов. Нажмите «Попросить совет».
        </p>
      )}
    </section>
  );
}
