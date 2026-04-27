/**
 * Browser-side GA4 helper. Safe to call from any client component:
 * - no-ops on the server
 * - no-ops if gtag isn't loaded (e.g. tracker blocker, no GA id set)
 */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", name, params ?? {});
}
