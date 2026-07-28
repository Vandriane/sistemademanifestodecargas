// Simple client-side mock auth for demo purposes.
export const AUTH_KEY = "slam_auth_v1";

export type Session = { email: string; loggedAt: number };

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function signIn(email: string) {
  const session: Session = { email, loggedAt: Date.now() };
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return session;
}

export function signOut() {
  window.localStorage.removeItem(AUTH_KEY);
}
