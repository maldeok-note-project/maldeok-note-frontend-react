// Route設定
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TopPage from "./pages/TopPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CategoryListPage from "./pages/CategoryListPage";
import CategoryCreatePage from "./pages/CategoryCreatePage";
import CategoryEditPage from "./pages/CategoryEditPage";
import ExpressionListPage from "./pages/ExpressionListPage";
import ExpressionDetailPage from "./pages/ExpressionDetailPage";
import ExpressionCreatePage from "./pages/ExpressionCreatePage";
import ExpressionEditPage from "./pages/ExpressionEditPage";
import FavoriteListPage from "./pages/FavoriteListPage";
import BadgeListPage from "./pages/BadgeListPage";

import Header from "./components/Header";
import AuthGuard from "./components/AuthGuard";

function App() {
  return (
    <BrowserRouter>
      {/* 全ページ共通ヘッダー */}
      <Header />

      <Routes>
        {/* ログイン不要なページ */}
        {/* トップページ */}
        <Route path="/" element={<TopPage />} />

        {/* 認証 */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 要ログインページ */}
        {/* カテゴリ */}
        <Route
          path="/categories"
          element={
            <AuthGuard>
              <CategoryListPage />
            </AuthGuard>
          }
        />
        <Route
          path="/categories/create"
          element={
            <AuthGuard>
              <CategoryCreatePage />
            </AuthGuard>
          }
        />
        <Route
          path="/categories/:id/edit"
          element={
            <AuthGuard>
              <CategoryEditPage />
            </AuthGuard>
          }
        />

        {/* 表現 */}
        <Route
          path="/expressions"
          element={
            <AuthGuard>
              <ExpressionListPage />
            </AuthGuard>
          }
        />
        <Route
          path="/expressions/:id"
          element={
            <AuthGuard>
              <ExpressionDetailPage />
            </AuthGuard>
          }
        />
        <Route
          path="/expressions/create"
          element={
            <AuthGuard>
              <ExpressionCreatePage />
            </AuthGuard>
          }
        />
        <Route
          path="/expressions/:id/edit"
          element={
            <AuthGuard>
              <ExpressionEditPage />
            </AuthGuard>
          }
        />

        {/* お気に入り */}
        <Route
          path="/favorites"
          element={
            <AuthGuard>
              <FavoriteListPage />
            </AuthGuard>
          }
        />

        {/* バッジ */}
        <Route
          path="/badges"
          element={
            <AuthGuard>
              <BadgeListPage />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
