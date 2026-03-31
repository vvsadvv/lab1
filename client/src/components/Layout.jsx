import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/httpClient";
import { useAuth } from "../context/AuthContext";
import { resolvePagePath } from "../utils/pagePaths";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuPages, setMenuPages] = useState([]);

  const loadMenu = async () => {
    try {
      const response = await api.get("/pages/public");
      setMenuPages(response.data);
    } catch (error) {
      setMenuPages([]);
    }
  };

  useEffect(() => {
    loadMenu();
  }, [location.pathname]);

  useEffect(() => {
    const refreshHandler = () => {
      loadMenu();
    };
    window.addEventListener("menu:refresh", refreshHandler);
    return () => window.removeEventListener("menu:refresh", refreshHandler);
  }, []);

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header__inner container">
          <Link to="/" className="brand">
            Aroma Lane
          </Link>

          <nav className="top-nav">
            {menuPages
              .filter((page) => page.showInMenu && page.isPublished)
              .map((page) => (
                <NavLink
                  key={page.id}
                  className="top-nav__link"
                  to={resolvePagePath(page.slug)}
                >
                  {page.menuLabel || page.title}
                </NavLink>
              ))}
            {isAuthenticated && (
              <>
                <NavLink className="top-nav__link top-nav__link--admin" to="/admin/pages">
                  Управление
                </NavLink>
                <NavLink className="top-nav__link top-nav__link--admin" to="/admin/feedback">
                  Заявки
                </NavLink>
                {user?.role === "admin" && (
                  <NavLink className="top-nav__link top-nav__link--admin" to="/admin/users">
                    Подтверждения
                  </NavLink>
                )}
              </>
            )}
          </nav>

          <div className="auth-box">
            {isAuthenticated ? (
              <>
                <span className="auth-box__user">{user?.username}</span>
                <button className="btn btn--ghost" onClick={onLogout} type="button">
                  Выйти
                </button>
              </>
            ) : (
              <Link className="btn btn--ghost" to="/login">
                Войти
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="site-main container">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p>Кафе Aroma Lane, 2026</p>
          <p>г. Москва, ул. Примерная, 10</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
