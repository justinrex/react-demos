import { NavLink, Outlet } from "react-router-dom";
import { demoPages } from "./routes";

export function Shell() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <p className="eyebrow">React Demos</p>
        <nav className="nav-list" aria-label="Demo pages">
          {demoPages.map((page) => (
            <NavLink key={page.slug} to={`/${page.slug}`} className={getNavClassName}>
              {page.title}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

function getNavClassName({ isActive }: { isActive: boolean }) {
  return isActive ? "nav-link nav-link-active" : "nav-link";
}
