import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/httpClient";

const DynamicPage = ({ fixedSlug }) => {
  const params = useParams();
  const slug = useMemo(() => fixedSlug || params.slug || "home", [fixedSlug, params.slug]);

  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPage = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await api.get(`/pages/public/${slug}`);
        setPage(response.data);
      } catch (requestError) {
        setError("Страница не найдена или временно недоступна.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPage();
  }, [slug]);

  if (isLoading) {
    return <p className="notice">Загрузка страницы...</p>;
  }

  if (error || !page) {
    return (
      <section className="card">
        <h1>Ошибка</h1>
        <p>{error}</p>
        <Link className="btn btn--primary" to="/">
          Вернуться на главную
        </Link>
      </section>
    );
  }

  const extra = page.extraData || {};

  return (
    <article className="page">
      <section className="hero card">
        <p className="hero__eyebrow">{page.summary}</p>
        <h1>{page.title}</h1>
        <p>{page.content}</p>
      </section>

      {page.pageType === "home" && (
        <section className="card split">
          <div>
            <h2>Почему выбирают нас</h2>
            <ul className="list">
              {(extra.highlightList || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          {extra.videoUrl && (
            <div className="video-box">
              <iframe
                src={extra.videoUrl}
                title="Видео о кафе"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </section>
      )}

      {page.pageType === "contacts" && (
        <section className="card">
          <h2>Контактная информация</h2>
          <div className="table-wrap">
            <table>
              <tbody>
                {(extra.rows || []).map((row) => (
                  <tr key={row[0]}>
                    <th>{row[0]}</th>
                    <td>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {page.pageType === "gallery" && (
        <section className="card">
          <h2>Наша атмосфера</h2>
          <div className="gallery-grid">
            {(extra.images || []).map((imageUrl) => (
              <img key={imageUrl} src={imageUrl} alt="Фотография кафе" loading="lazy" />
            ))}
          </div>
        </section>
      )}

      {page.pageType === "feedback" && (
        <section className="card">
          <h2>Оставить отзыв</h2>
          <p>Перейдите в форму обратной связи:</p>
          <Link className="btn btn--primary" to="/feedback">
            Перейти к форме
          </Link>
        </section>
      )}

      {page.pageType === "custom" && (
        <section className="card">
          <h2>Дополнительные материалы</h2>
          {extra.imageUrl && <img className="cover-image" src={extra.imageUrl} alt={page.title} />}
          {extra.videoUrl && (
            <div className="video-box">
              <iframe
                src={extra.videoUrl}
                title={page.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </section>
      )}
    </article>
  );
};

export default DynamicPage;
