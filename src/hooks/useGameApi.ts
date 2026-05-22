interface MessageKeyResponse {
  key: string;
  index: number;
}

interface ThemeClickResponse {
  phase: "insult" | "threat" | "warning" | "corrupt";
  key?: string;
  index?: number;
  pixelatedIp?: string;
  ip?: string;
}

interface SessionResponse {
  sessionId: string;
  isNuked: boolean;
  themeClicks: number;
}

const API_URL = import.meta.env.PUBLIC_API_URL;

async function request<T>(path: string, method: "GET" | "POST" = "POST"): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export function useGameApi() {
  const getSession = () => request<SessionResponse>("/game/session", "GET");

  const vote = () => request<MessageKeyResponse>("/game/vote");

  const themeClick = () => request<ThemeClickResponse>("/game/theme-click");

  const langSwitch = () => request<MessageKeyResponse>("/game/lang-switch");

  const nuke = () => request<{ success: boolean }>("/game/nuke");

  return { getSession, vote, themeClick, langSwitch, nuke };
}

export type { MessageKeyResponse, ThemeClickResponse, SessionResponse };
