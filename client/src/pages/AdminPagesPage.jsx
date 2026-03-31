import { useEffect, useMemo, useState } from "react";
import api from "../api/httpClient";

const emptyForm = {
  slug: "",
  title: "",
  summary: "",
  content: "",
  pageType: "custom",
  menuLabel: "",
  menuOrder: 10,
  showInMenu: true,
  isPublished: true,
  extraDataText: "{}",
};

const AdminPagesPage = () => {
  const [pages, setPages] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedPages = useMemo(
    () =>
      [...pages].sort((first, second) => {
        return first.menuOrder - second.menuOrder;
      }),
    [pages]
  );

  const loadPages = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/pages");
      setPages(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Не удалось загрузить список страниц");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const startEdit = (page) => {
    setEditingId(page.id);
    setForm({
      slug: page.slug,
      title: page.title,
      summary: page.summary || "",
      content: page.content || "",
      pageType: page.pageType || "custom",
      menuLabel: page.menuLabel || "",
      menuOrder: Number(page.menuOrder || 0),
      showInMenu: Boolean(page.showInMenu),
      isPublished: Boolean(page.isPublished),
      extraDataText: JSON.stringify(page.extraData || {}, null, 2),
    });
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    let parsedExtraData = {};
    try {
      parsedExtraData = form.extraDataText?.trim() ? JSON.parse(form.extraDataText) : {};
    } catch (parseError) {
      setIsSubmitting(false);
      setError("Поле extraData должно содержать корректный JSON");
      return;
    }

    const payload = {
      slug: form.slug,
      title: form.title,
      summary: form.summary,
      content: form.content,
      pageType: form.pageType,
      menuLabel: form.menuLabel,
      menuOrder: Number(form.menuOrder),
      showInMenu: Boolean(form.showInMenu),
      isPublished: Boolean(form.isPublished),
      extraData: parsedExtraData,
    };

    try {
      if (editingId) {
        await api.put(`/pages/${editingId}`, payload);
      } else {
        await api.post("/pages", payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadPages();
      window.dispatchEvent(new Event("menu:refresh"));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Не удалось сохранить страницу");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removePage = async (page) => {
    const isConfirmed = window.confirm(`Удалить страницу "${page.title}"?`);
    if (!isConfirmed) {
      return;
    }
    try {
      await api.delete(`/pages/${page.id}`);
      await loadPages();
      window.dispatchEvent(new Event("menu:refresh"));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Не удалось удалить страницу");
    }
  };

  return (
    <section className="admin-layout">
      <article className="card">
        <div className="row-between">
          <h1>{editingId ? "Редактирование страницы" : "Новая страница"}</h1>
          <button type="button" className="btn btn--ghost" onClick={startCreate}>
            Очистить
          </button>
        </div>

        <form className="form-grid" onSubmit={submit}>
          <label>
            Slug
            <input
              required
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
              placeholder="menu"
            />
          </label>

          <label>
            Заголовок
            <input
              required
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
          </label>

          <label>
            Тип страницы
            <select
              value={form.pageType}
              onChange={(event) => setForm((prev) => ({ ...prev, pageType: event.target.value }))}
            >
              <option value="custom">custom</option>
              <option value="home">home</option>
              <option value="contacts">contacts</option>
              <option value="gallery">gallery</option>
              <option value="feedback">feedback</option>
            </select>
          </label>

          <label>
            Пункт меню
            <input
              value={form.menuLabel}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, menuLabel: event.target.value }))
              }
            />
          </label>

          <label>
            Порядок в меню
            <input
              type="number"
              value={form.menuOrder}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, menuOrder: event.target.value }))
              }
            />
          </label>

          <label className="inline-checkbox">
            <input
              type="checkbox"
              checked={form.showInMenu}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, showInMenu: event.target.checked }))
              }
            />
            Показать в меню
          </label>

          <label className="inline-checkbox">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, isPublished: event.target.checked }))
              }
            />
            Опубликована
          </label>

          <label className="form-grid__wide">
            Краткое описание
            <input
              value={form.summary}
              onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
            />
          </label>

          <label className="form-grid__wide">
            Основной текст
            <textarea
              rows="5"
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
            />
          </label>

          <label className="form-grid__wide">
            extraData (JSON)
            <textarea
              rows="7"
              value={form.extraDataText}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, extraDataText: event.target.value }))
              }
            />
          </label>

          <button className="btn btn--primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Сохранение..." : editingId ? "Обновить" : "Создать"}
          </button>
        </form>

        {error && <p className="notice notice--error">{error}</p>}
      </article>

      <article className="card">
        <h2>Существующие страницы</h2>
        {loading ? (
          <p className="notice">Загрузка списка...</p>
        ) : (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Slug</th>
                  <th>Заголовок</th>
                  <th>Тип</th>
                  <th>Меню</th>
                  <th>Публикация</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {sortedPages.map((page) => (
                  <tr key={page.id}>
                    <td>{page.slug}</td>
                    <td>{page.title}</td>
                    <td>{page.pageType}</td>
                    <td>{page.showInMenu ? "Да" : "Нет"}</td>
                    <td>{page.isPublished ? "Да" : "Нет"}</td>
                    <td className="table-actions">
                      <button type="button" className="btn btn--ghost" onClick={() => startEdit(page)}>
                        Изменить
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger"
                        onClick={() => removePage(page)}
                        disabled={page.slug === "home"}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
};

export default AdminPagesPage;
