import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/httpClient";

const FeedbackPage = () => {
  const [intro, setIntro] = useState({
    title: "Обратная связь",
    summary: "Оставьте ваш отзыв",
    content: "",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const response = await api.get("/pages/public/feedback");
        setIntro(response.data);
      } catch (error) {
        setIntro((prev) => prev);
      }
    };
    loadPage();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");
    try {
      await api.post("/feedback/public", form);
      setStatus("Спасибо! Сообщение отправлено.");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus(error.response?.data?.message || "Не удалось отправить сообщение.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card feedback-card">
      <p className="hero__eyebrow">{intro.summary}</p>
      <h1>{intro.title}</h1>
      <p>{intro.content}</p>

      <form className="form-grid feedback-form" onSubmit={onSubmit}>
        <label>
          Имя
          <input
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
        </label>

        <label>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
        </label>

        <label className="form-grid__wide">
          Сообщение
          <textarea
            required
            rows="5"
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          />
        </label>

        <div className="feedback-actions form-grid__wide">
          <button disabled={submitting} className="btn btn--primary" type="submit">
            {submitting ? "Отправка..." : "Отправить"}
          </button>
          <Link className="btn btn--ghost" to="/">
            На главную
          </Link>
        </div>
      </form>

      {status && <p className="notice">{status}</p>}
    </section>
  );
};

export default FeedbackPage;
