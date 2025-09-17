import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getJob, updateJob, STATUS_OPTIONS, STATUS_LABELS } from "../services/jobs.js";

function toInputDate(v) {
  if (!v) return new Date().toISOString().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const d = new Date(v);
  return isNaN(d) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
}

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const job = getJob(id);
    if (!job) {
      alert("Candidatura no encontrada.");
      navigate("/dashboard");
      return;
    }
    setForm({
      id: job.id,
      title: String(job.title ?? ""),
      company: String(job.company ?? ""),
      status: STATUS_OPTIONS.includes(job.status) ? job.status : "applied",
      date: toInputDate(job.date),
      link: String(job.link ?? ""),
      notes: String(job.notes ?? ""),
      tags: Array.isArray(job.tags) ? job.tags.join(", ") : String(job.tags ?? ""),
    });
  }, [id, navigate]);

  if (!form) return <p className="p-4">Cargando…</p>;

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
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f.date)) e.date = "Fecha inválida.";
    return e;
  }

  function onSubmit(e) {
    e.preventDefault();
    const eObj = validate(form);
    setErrors(eObj);
    if (Object.keys(eObj).length) return;

    updateJob(form.id, {
      title: form.title,
      company: form.company,
      status: form.status,
      date: toInputDate(form.date),
      link: form.link,
      notes: form.notes,
      tags: form.tags, // el servicio lo normaliza a array
    });

    navigate("/dashboard");
  }

  const inputBase =
    "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-950/70 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <section className="max-w-xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Editar candidatura</h1>
      </header>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Puesto *</label>
          <input name="title" value={form.title} onChange={onChange} className={inputBase} />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Empresa *</label>
          <input name="company" value={form.company} onChange={onChange} className={inputBase} />
          {errors.company && <p className="text-sm text-red-500 mt-1">{errors.company}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Estado</label>
            <select name="status" value={form.status} onChange={onChange} className={inputBase}>
              {STATUS_OPTIONS.map(key => (
                <option value={key} key={key}>{STATUS_LABELS[key]}</option>
              ))}
            </select>
            {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Fecha</label>
            <input type="date" name="date" value={form.date} onChange={onChange} className={inputBase} />
            {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Enlace</label>
          <input name="link" value={form.link} onChange={onChange} className={inputBase} placeholder="https://..." />
          {errors.link && <p className="text-sm text-red-500 mt-1">{errors.link}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Requisitos</label>
          <textarea name="notes" value={form.notes} onChange={onChange} rows={4} className={inputBase} />
        </div>

        <div>
          <label className="block text-sm mb-1">Tags (separados por coma)</label>
          <input name="tags" value={form.tags} onChange={onChange} className={inputBase} placeholder="remoto, junior, madrid" />
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">
            Guardar cambios
          </button>
          <Link to="/dashboard" className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}
