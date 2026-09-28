/**
 * PWD Delhi / CPWD-style DSR catalog for DE editor.
 * Backed by Sample CPWD/Delhi DSR seed (see data/PWD_DELHI_DSR_seed.csv).
 * Replace with official PWD Delhi schedule when provided — not for tender award.
 */

import type { DSRItem } from './types';
import { PWD_DELHI_DSR_SEED, PWD_DELHI_DSR_SEED_COUNT } from './data/pwdDelhiDsrSeed';

/** Banner shown in DE editor — accurate source label (not official GNCTD). */
export const DSR_CATALOG_BANNER =
  'Sample CPWD/Delhi DSR seed — replace with official PWD Delhi schedule when provided; not for tender award. Not an official GNCTD / PWD Delhi / CPWD publication.';

/** @deprecated Prefer DSR_CATALOG_BANNER — kept for callers that still import DEMO_DSR_BANNER. */
export const DEMO_DSR_BANNER = DSR_CATALOG_BANNER;

/** Full schedule catalog loaded by the DE picker. */
export const DSR_CATALOG: readonly DSRItem[] = PWD_DELHI_DSR_SEED;

export const DSR_CATALOG_COUNT = PWD_DELHI_DSR_SEED_COUNT;

/** @deprecated Prefer DSR_CATALOG — alias kept for estimateStore / index exports. */
export const DEMO_DSR_CATALOG = DSR_CATALOG;

export function searchDSR(
  query: string,
  category?: DSRItem['category'] | 'all',
): DSRItem[] {
  const q = query.trim().toLowerCase();
  return DSR_CATALOG.filter((item) => {
    if (category && category !== 'all' && item.category !== category) return false;
    if (!q) return true;
    return (
      item.code.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.unit.toLowerCase().includes(q)
    );
  });
}

/** @deprecated Prefer searchDSR — alias kept for DEEditorPage. */
export function searchDemoDSR(
  query: string,
  category?: DSRItem['category'] | 'all',
): DSRItem[] {
  return searchDSR(query, category);
}
