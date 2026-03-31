import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import DynamicPage from "./pages/DynamicPage";
import FeedbackPage from "./pages/FeedbackPage";
import LoginPage from "./pages/LoginPage";
import AdminPagesPage from "./pages/AdminPagesPage";
import AdminFeedbackPage from "./pages/AdminFeedbackPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<DynamicPage fixedSlug="home" />} />
            <Route path="/contacts" element={<DynamicPage fixedSlug="contacts" />} />
            <Route path="/gallery" element={<DynamicPage fixedSlug="gallery" />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/page/:slug" element={<DynamicPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/admin/pages" element={<AdminPagesPage />} />
              <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>

            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
