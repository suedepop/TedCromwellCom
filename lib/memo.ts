/**
 * Minimal in-process TTL memoization for server-side data fetchers.
 *
 * Lives in module scope, so each Azure SWA function instance keeps its own
 * cache and shares it across concurrent requests it handles. Cold starts pay
 * the underlying cost once; subsequent requests within the TTL serve from
 * memory. There is no cross-instance coordination — that's the responsibility
 * of the edge cache (staticwebapp.config.json Cache-Control overrides) and
 * Next.js ISR (route segment `revalidate`).
 *
 * Args are serialized via JSON.stringify, so wrap functions whose arguments
 * are primitive / plain-object only.
 */

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

export function memo<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  ttlMs: number,
  keyPrefix: string,
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> => {
    const key = args.length === 0 ? keyPrefix : `${keyPrefix}:${JSON.stringify(args)}`;
    const now = Date.now();
    const hit = cache.get(key);
    if (hit && hit.expiresAt > now) {
      return hit.value as TResult;
    }
    const value = await fn(...args);
    cache.set(key, { value, expiresAt: now + ttlMs });
    return value;
  };
}
