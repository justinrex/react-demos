import { NavLink, Outlet } from "react-router-dom";
import { demoPages } from "./routes";

export function Shell() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="sidebar">
        <header className="sidebar-header">
          <p className="eyebrow">React Demos</p>
        </header>
        <nav className="nav-list" aria-label="Demo pages">
          <ul className="nav-items">
            {demoPages.map((page) => (
              <li key={page.slug}>
                <NavLink
                  to={`/${page.slug}`}
                  className={getNavClassName}
                  onMouseEnter={() => {
                    void page.preload();
                  }}
                  onFocus={() => {
                    void page.preload();
                  }}
                >
                  <span className="nav-link-title">{page.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="content" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}

function getNavClassName({ isActive }: { isActive: boolean }) {
  return isActive ? "nav-link nav-link-active" : "nav-link";
}
