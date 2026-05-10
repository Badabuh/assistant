const geminiApiKeyStorageKey = "economic-gemini-api-key";
const envGeminiApiKey = import.meta.env.VITE_GEMINI_API_KEY ?? "";

export function loadGeminiApiKey() {
  if (typeof window === "undefined") {
    return envGeminiApiKey;
  }

  if (envGeminiApiKey.trim()) {
    return envGeminiApiKey;
  }

  return window.localStorage.getItem(geminiApiKeyStorageKey) ?? "";
}

export function saveGeminiApiKey(apiKey: string) {
  if (typeof window === "undefined") {
    return;
  }

  if (!apiKey.trim()) {
    window.localStorage.removeItem(geminiApiKeyStorageKey);
    return;
  }

  window.localStorage.setItem(geminiApiKeyStorageKey, apiKey.trim());
}
