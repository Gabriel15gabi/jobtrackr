import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Add from "./pages/Add.jsx";
import Edit from "./pages/Edit.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <Routes>
      {/* El Layout va como "element" y dentro van las rutas hijas */}
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<Add />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/settings" element={<Settings />} />
        {/* 404 */}
        <Route path="*" element={<div className="p-6">404 - Página no encontrada</div>} />
      </Route>
    </Routes>
  );
}
