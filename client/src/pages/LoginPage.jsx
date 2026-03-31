import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin/pages" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (mode === "register") {
        if (form.password !== form.confirmPassword) {
          setError("Пароли не совпадают");
          setLoading(false);
          return;
        }
        const response = await register(form.username, form.password);
        setSuccess(
          response?.message ||
            "Регистрация отправлена. Ожидайте подтверждения администратором."
        );
        setMode("login");
        setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
        return;
      } else {
        await login(form.username, form.password);
      }
      navigate(location.state?.from || "/admin/pages", { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          (mode === "register" ? "Ошибка регистрации" : "Ошибка входа")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card auth-card">
      <div className="auth-switch">
        <button
          className={`btn ${mode === "login" ? "btn--primary" : "btn--ghost"}`}
          type="button"
          onClick={() => {
            setMode("login");
            setError("");
            setSuccess("");
          }}
        >
          Вход
        </button>
        <button
          className={`btn ${mode === "register" ? "btn--primary" : "btn--ghost"}`}
          type="button"
          onClick={() => {
            setMode("register");
            setError("");
            setSuccess("");
          }}
        >
          Регистрация
        </button>
      </div>

      <h1>{mode === "register" ? "Регистрация пользователя" : "Вход для редактора"}</h1>
      <p>
        {mode === "register"
          ? "После регистрации учетная запись получит статус pending до подтверждения администратором."
          : "Для демо: логин `admin`, пароль `admin123`."}
      </p>

      <form className="form-grid" onSubmit={submit}>
        <label>
          Логин
          <input
            required
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
          />
        </label>
        <label>
          Пароль
          <input
            required
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
        </label>

        {mode === "register" && (
          <label>
            Повторите пароль
            <input
              required
              type="password"
              value={form.confirmPassword}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
              }
            />
          </label>
        )}

        <div className="form-grid__wide">
          <button className="btn btn--primary" disabled={loading} type="submit">
            {loading
              ? mode === "register"
                ? "Регистрация..."
                : "Вход..."
              : mode === "register"
              ? "Зарегистрироваться"
              : "Войти"}
          </button>
        </div>
      </form>

      {error && <p className="notice notice--error">{error}</p>}
      {success && <p className="notice notice--success">{success}</p>}
    </section>
  );
};

export default LoginPage;
