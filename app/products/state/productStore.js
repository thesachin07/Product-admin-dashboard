const KEY = 'product_local_changes';

function read() {
  if (typeof window === 'undefined') {
    return { added: [], updated: {}, deleted: [] };
  }
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { added: [], updated: {}, deleted: [] };
  } catch {
    return { added: [], updated: {}, deleted: [] };
  }
}

function write(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getLocalChanges() {
  return read();
}

export function addLocalProduct(product) {
  const data = read();
  data.added.unshift(product);
  write(data);
}

export function updateLocalProduct(id, product) {
  const data = read();
  data.updated[id] = { ...(data.updated[id] || {}), ...product };
  write(data);
}

export function deleteLocalProduct(id) {
  const data = read();
  if (!data.deleted.includes(id)) data.deleted.push(id);
  data.added = data.added.filter((p) => p.id !== id);
  write(data);
}

export function mergeWithLocal(apiProducts) {
  const changes = read();

  const deletedSet = new Set(changes.deleted);

  const merged = apiProducts
    .filter((p) => !deletedSet.has(p.id))
    .map((p) => (changes.updated[p.id] ? { ...p, ...changes.updated[p.id] } : p));

  const addedFiltered = changes.added.filter((p) => !deletedSet.has(p.id));

  return [...addedFiltered, ...merged];
}