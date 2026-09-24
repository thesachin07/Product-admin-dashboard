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
  const key = String(id);
  data.updated[key] = { ...(data.updated[key] || {}), ...product };
  write(data);
}

export function deleteLocalProduct(id) {
  const data = read();
  const key = String(id);
  if (!data.deleted.includes(key)) data.deleted.push(key);
  data.added = data.added.filter((p) => String(p.id) !== key);
  write(data);
}

export function mergeWithLocal(apiProducts) {
  const changes = read();
  const deletedSet = new Set(changes.deleted.map(String));

  const merged = apiProducts
    .filter((p) => !deletedSet.has(String(p.id)))
    .map((p) => {
      const override = changes.updated[String(p.id)];
      return override ? { ...p, ...override } : p;
    });

  const addedFiltered = changes.added
    .filter((p) => !deletedSet.has(String(p.id)))
    .filter((p) => !merged.some((m) => String(m.id) === String(p.id)));

  return [...addedFiltered, ...merged];
}