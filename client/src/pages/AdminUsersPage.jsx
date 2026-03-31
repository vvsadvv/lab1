import { useEffect, useState } from "react";
import api from "../api/httpClient";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const loadPendingUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/users/pending");
      setUsers(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Не удалось загрузить заявки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const approve = async (id) => {
    setError("");
    setInfo("");
    try {
      await api.patch(`/users/${id}/approve`);
      setInfo("Пользователь подтвержден");
      await loadPendingUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Ошибка подтверждения");
    }
  };

  const reject = async (id) => {
    const isConfirmed = window.confirm("Отклонить регистрацию этого пользователя?");
    if (!isConfirmed) return;

    setError("");
    setInfo("");
    try {
      await api.delete(`/users/${id}/reject`);
      setInfo("Заявка отклонена");
      await loadPendingUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Ошибка отклонения");
    }
  };

  return (
    <section className="card">
      <h1>Подтверждение регистраций</h1>
      <p>Пользователи со статусом pending не могут войти, пока вы не подтвердите заявку.</p>

      {loading && <p className="notice">Загрузка...</p>}
      {error && <p className="notice notice--error">{error}</p>}
      {info && <p className="notice notice--success">{info}</p>}

      {!loading && users.length === 0 && <p className="notice">Нет ожидающих заявок.</p>}

      <div className="pending-users">
        {users.map((user) => (
          <article key={user.id} className="pending-user-item">
            <div>
              <h3>{user.username}</h3>
              <p>
                Создан: {new Date(user.createdAt).toLocaleString("ru-RU")} | Статус: {user.role}
              </p>
            </div>
            <div className="table-actions">
              <button className="btn btn--primary" type="button" onClick={() => approve(user.id)}>
                Подтвердить
              </button>
              <button className="btn btn--danger" type="button" onClick={() => reject(user.id)}>
                Отклонить
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminUsersPage;
