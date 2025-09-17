import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJobs, deleteJob, STATUS_LABELS } from "../services/jobs.js";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    setJobs(getJobs());
  }, []);

  function handleDelete(id) {
    const ok = confirm("¿Seguro que quieres eliminar esta candidatura?");
    if (!ok) return;
    deleteJob(id);
    setJobs(getJobs());
  }

  return (
    <section className="section">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Mis candidaturas</h1>
        <Link to="/add" className="btn-primary">Añadir</Link>
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-400">
          Aún no hay candidaturas. Crea la primera desde “Añadir”.
        </p>
      ) : (
        <ul className="grid gap-3">
          {jobs.map((job) => {
            const tagsText = Array.isArray(job.tags)
              ? job.tags.join(", ")
              : job.tags || "";

            return (
              <li key={job.id} className="card p-4">
                <div className="flex items-start justify-between gap-4">
                  {/* INFO */}
                  <div className="min-w-0">
                    <h3 className="font-medium truncate">
                      {job.title} —{" "}
                      <span className="text-gray-300">{job.company}</span>
                    </h3>

                    <p className="text-sm text-gray-400">
                      {STATUS_LABELS[job.status] || job.status} ·{" "}
                      {new Date(job.date).toLocaleDateString()}
                      {tagsText ? <> · {tagsText}</> : null}
                    </p>

                    {job.link && (
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm underline text-emerald-400"
                      >
                        Ver oferta
                      </a>
                    )}

                    {job.notes && (
      <div className="mt-3">
      <h4 className="text-xs uppercase tracking-wider text-gray-400">Requisitos</h4>
      <p className="mt-1 text-sm">{job.notes}</p>
      </div>
)}
                  </div>

                  {/* ACCIONES */}
                  <div className="flex-shrink-0 flex gap-2">
                    <Link to={`/edit/${job.id}`} className="btn-ghost">
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="btn-primary bg-red-600 hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
