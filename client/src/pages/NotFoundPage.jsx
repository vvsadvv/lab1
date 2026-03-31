import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <section className="card">
      <h1>404</h1>
      <p>Такой страницы не существует.</p>
      <Link className="btn btn--primary" to="/">
        На главную
      </Link>
    </section>
  );
};

export default NotFoundPage;
