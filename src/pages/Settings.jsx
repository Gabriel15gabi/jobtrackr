import { useMemo, useRef, useState } from "react";
import {
  getJobs,
  clearAllJobs,
  importJobsFromArray,
} from "../services/jobs.js";

export default function Settings() {
  const [count, setCount] = useState(getJobs().length);
  const [mergeImport, setMergeImport] = useState(true);
  const [importInfo, setImportInfo] = useState(null);
  const fileInputRef = useRef(null);

  const hasData = useMemo(() => count > 0, [count]);

  function refreshCount() {
    setCount(getJobs().length);
  }

  // --- Exportar: generamos un blob y forzamos descarga
  function handleExport() {
    const data = getJobs();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const fecha = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `jobtrackr-${fecha}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // --- Importar: leer archivo, parsear JSON y llamar al servicio
  function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result));
        const res = importJobsFromArray(json, { merge: mergeImport });
        setImportInfo({ ok: true, ...res });
        refreshCount();
      } catch (err) {
        console.error(err);
        setImportInfo({ ok: false, error: String(err) });
      } finally {
        // reset para permitir re-subir el mismo archivo si hace falta
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.onerror = () => {
      setImportInfo({ ok: false, error: "No se pudo leer el archivo." });
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  }

  // --- Borrar todo (confirmación)
  function handleClearAll() {
    const ok = confirm(
      "¿Seguro que quieres borrar TODAS las candidaturas? Esta acción no se puede deshacer."
    );
    if (!ok) return;
    clearAllJobs();
    refreshCount();
    setImportInfo(null);
  }

  return (
    <section className="max-w-2xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Ajustes</h1>
        <p className="text-sm text-gray-500">
          Herramientas para gestionar tus datos.
        </p>
      </header>

      {/* Resumen */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <p>
          Candidaturas guardadas:{" "}
          <span className="font-semibold">{count}</span>
        </p>
      </div>

      {/* Exportar */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3">
        <h2 className="text-lg font-medium">Exportar</h2>
        <p className="text-sm text-gray-500">
          Descarga todas tus candidaturas en un archivo JSON.
        </p>
        <button
          onClick={handleExport}
          className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
          disabled={!hasData}
          title={!hasData ? "No hay datos que exportar" : ""}
        >
          Exportar JSON
        </button>
      </div>

      {/* Importar */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3">
        <h2 className="text-lg font-medium">Importar</h2>
        <p className="text-sm text-gray-500">
          Sube un JSON exportado previamente. Puedes{" "}
          <span className="font-medium">fusionar</span> con tus datos actuales
          o <span className="font-medium">reemplazarlos</span>.
        </p>

        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={mergeImport}
            onChange={(e) => setMergeImport(e.target.checked)}
          />
          Fusionar (si lo quitas, reemplaza todo)
        </label>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            className="block text-sm"
          />
        </div>

        {importInfo && (
          <div
            className={`text-sm mt-2 ${
              importInfo.ok ? "text-green-600" : "text-red-600"
            }`}
          >
            {importInfo.ok
              ? `Importación completada (${importInfo.mode === "merge" ? "fusionado" : "reemplazado"}). Total: ${importInfo.count}.`
              : `Error importando: ${importInfo.error}`}
          </div>
        )}
      </div>

      {/* Borrar todo */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3">
        <h2 className="text-lg font-medium">Borrar todos los datos</h2>
        <p className="text-sm text-gray-500">
          Elimina todas tus candidaturas de este navegador.
        </p>
        <button
          onClick={handleClearAll}
          className="rounded-lg bg-red-600 text-white px-4 py-2 hover:bg-red-700"
          disabled={!hasData}
          title={!hasData ? "No hay nada que borrar" : ""}
        >
          Borrar todo
        </button>
      </div>
    </section>
  );
}
