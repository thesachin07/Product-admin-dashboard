const VALID_LIMITS = [10, 20, 50];
const VALID_SORTS = ['price', 'rating', 'title'];

export function parsePage(raw) {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return 1;
  return n;
}

export function parseLimit(raw) {
  const n = Number(raw);
  return VALID_LIMITS.includes(n) ? n : 10;
}

export function parseSortBy(raw) {
  return VALID_SORTS.includes(raw) ? raw : '';
}

export function parseOrder(raw) {
  return raw === 'desc' ? 'desc' : 'asc';
}

export function parseString(raw) {
  return typeof raw === 'string' ? raw.trim() : '';
}