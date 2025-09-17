import { useState } from "react";
import { addJob, STATUS_OPTIONS, STATUS_LABELS } from "../services/jobs.js";
import { useNavigate, Link } from "react-router-dom";

const today = new Date().toISOString().slice(0, 10);

export default function Add() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    company: "",
    status: "applied",
    date: today,
    link: "",
    notes: "",
    tags: "",    // coma separada
  });
  const [errors, setErrors] = useState({});

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function validate(f) {
    const e = {};
    if (!f.title.trim()) e.title = "El puesto es obligatorio.";
    if (!f.company.trim()) e.company = "La empresa es obligatoria.";
    if (f.link && !/^https?:\/\//i.test(f.link)) e.link = "Debe empezar por http:// o https://";
    if (!STATUS_OPTIONS.includes(f.status)) e.status = "Estado inválido.";
    return e;
  }

  function onSubmit(e) {
    e.preventDefault();
    const eObj = validate(form);
    setErrors(eObj);
    if (Object.keys(eObj).length) return;

    addJob(form);
    navigate("/dashboard");
  }

  const inputBase =
    "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-950/70 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <section className="section">
      <div className="card p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Nueva candidatura</h1>
          <p className="text-sm text-gray-500">Completa los datos y guarda. Podrás editarla luego.</p>
        </header>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Puesto *</label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              className={inputBase}
              placeholder="Frontend Junior"
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Empresa *</label>
            <input
              name="company"
              value={form.company}
              onChange={onChange}
              className={inputBase}
              placeholder="Acme Inc."
            />
            {errors.company && <p className="text-sm text-red-500 mt-1">{errors.company}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Estado</label>
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className={inputBase}
              >
                {STATUS_OPTIONS.map(key => (
                  <option value={key} key={key}>{STATUS_LABELS[key]}</option>
                ))}
              </select>
              {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1">Fecha</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={onChange}
                className={inputBase}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Enlace a la oferta</label>
            <input
              name="link"
              value={form.link}
              onChange={onChange}
              className={inputBase}
              placeholder="https://..."
            />
            {errors.link && <p className="text-sm text-red-500 mt-1">{errors.link}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Requisitos</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={onChange}
              rows={4}
              className={inputBase}
              placeholder="carnet, inglés B2, disponibilidad…"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Tags (separados por coma)</label>
            <input
              name="tags"
              value={form.tags}
              onChange={onChange}
              className={inputBase}
              placeholder="remoto, junior, madrid"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn-primary">Guardar</button>
            <Link to="/dashboard" className="btn-ghost">Cancelar</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
