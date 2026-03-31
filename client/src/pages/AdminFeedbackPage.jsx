import { useEffect, useState } from "react";
import api from "../api/httpClient";

const AdminFeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFeedback = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/feedback");
        setFeedbackList(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Не удалось загрузить отзывы");
      } finally {
        setLoading(false);
      }
    };
    loadFeedback();
  }, []);

  return (
    <section className="card">
      <h1>Заявки и обратная связь</h1>
      {loading && <p className="notice">Загрузка...</p>}
      {error && <p className="notice notice--error">{error}</p>}

      <div className="feedback-list">
        {feedbackList.map((entry) => (
          <article key={entry.id} className="feedback-item">
            <div className="row-between">
              <h3>{entry.name}</h3>
              <time>{new Date(entry.createdAt).toLocaleString("ru-RU")}</time>
            </div>
            <p>
              <strong>Email:</strong> {entry.email}
            </p>
            <p>{entry.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminFeedbackPage;
