const KEY = "jobs.v1";

export const STATUS_OPTIONS = ["applied", "interview", "offer", "rejected", "wishlist"];
export const STATUS_LABELS = {
  applied: "Aplicada",
  interview: "Entrevista",
  offer: "Oferta",
  rejected: "Rechazada",
  wishlist: "Interesado",
};

function readRaw() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function normalizeTags(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(t => String(t).trim().toLowerCase()).filter(Boolean);
  return String(input).split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
}

function toISODate(v) {
  if (!v) return new Date().toISOString().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const d = new Date(v);
  return isNaN(d) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
}

function sanitizeJob(j) {
  return {
    id: j.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: (j.title ?? "").trim(),
    company: (j.company ?? "").trim(),
    status: STATUS_OPTIONS.includes(j.status) ? j.status : "applied",
    date: toISODate(j.date),
    link: (j.link ?? "").trim(),
    notes: (j.notes ?? "").trim(),
    tags: normalizeTags(j.tags),
    createdAt: j.createdAt ?? new Date().toISOString(),
    updatedAt: j.updatedAt ?? new Date().toISOString(),
  };
}

function read() {
  return readRaw().map(sanitizeJob);
}

function write(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}

export function getJobs() {
  return read().sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getJob(id) {
  const j = read().find(x => x.id === id);
  return j ? sanitizeJob(j) : null;
}

export function addJob(input) {
  const now = new Date().toISOString();
  const job = sanitizeJob({ ...input, createdAt: now, updatedAt: now });
  const arr = read();
  arr.push(job);
  write(arr);
  return job;
}

export function updateJob(id, updates) {
  const arr = read();
  const i = arr.findIndex(j => j.id === id);
  if (i === -1) return null;

  const merged = sanitizeJob({ ...arr[i], ...updates, updatedAt: new Date().toISOString() });
  arr[i] = merged;
  write(arr);
  return merged;
}

export function deleteJob(id) {
  const arr = read();
  const next = arr.filter(j => j.id !== id);
  write(next);
  return next.length !== arr.length;
}


// ---  utilidades para Ajustes -----

export function clearAllJobs() {
  localStorage.removeItem(KEY);
}

export function replaceAllJobs(arr) {
  // Reemplaza todo por 'arr' normalizando cada item
  write(arr.map(sanitizeJob));
}

export function importJobsFromArray(arr, { merge = false } = {}) {
  if (!Array.isArray(arr)) throw new Error("Formato inválido: se esperaba un array.");
  const incoming = arr.map(sanitizeJob);

  if (!merge) {
    // Reemplazar por completo
    write(incoming);
    return { mode: "replace", count: incoming.length };
  }

  // Fusionar con existentes por id (evita duplicados)
  const current = read();
  const byId = new Map(current.map(j => [j.id, j]));
  for (const j of incoming) byId.set(j.id, j);
  const merged = Array.from(byId.values());
  write(merged);
  return { mode: "merge", count: merged.length };
}
