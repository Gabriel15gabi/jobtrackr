import { Outlet, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm transition ${
        active ? "bg-white/10 text-emerald-400" : "hover:bg-white/5"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Layout() {
  const location = useLocation();
  const [dark, setDark] = useState(
    () =>
      localStorage.getItem("prefers-dark") === "true" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("prefers-dark", String(dark));
  }, [dark]);

  const is = (path) => location.pathname === path;

  return (
    <div className="min-h-screen text-gray-100">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/10">
        <div className="container-page flex items-center justify-between py-4">
          {/* Logo + marca */}
          <Link to="/dashboard" className="flex items-center gap-3">
            {/* Logo SVG estilizado */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" className="w-7 h-7">
              <defs>
                <linearGradient id="jt" x1="0" x2="1">
                  <stop offset="0" stopColor="#34d399"/>
                  <stop offset="1" stopColor="#10b981"/>
                </linearGradient>
              </defs>
              <rect x="3" y="8" width="30" height="20" rx="5" fill="url(#jt)" opacity=".25"/>
              <path d="M12 12h12v-2a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v2z" fill="url(#jt)"/>
              <path d="M11 18h14" stroke="url(#jt)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="font-semibold tracking-wide">JobTrackr</span>
          </Link>

          {/* Navegación */}
          <nav className="flex items-center gap-1">
            <NavLink to="/dashboard" active={is("/dashboard")}>Dashboard</NavLink>
            <NavLink to="/add" active={is("/add")}>Añadir</NavLink>
            <NavLink to="/settings" active={is("/settings")}>Ajustes</NavLink>
          </nav>

          {/* Switch tema */}
          <button
            onClick={() => setDark(d => !d)}
            className="btn-ghost rounded-xl"
            title={dark ? "Modo claro" : "Modo oscuro"}
          >
            {dark ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
        </div>
      </header>

      {/* MAIN centrado */}
      <main className="container-page">
        <Outlet />
      </main>
    </div>
  );
}
