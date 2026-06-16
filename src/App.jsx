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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* トップページ */}
        <Route path="/" element={<TopPage />} />

        {/* 認証 */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* カテゴリ */}
        <Route path="/categories" element={<CategoryListPage />} />
        <Route path="/categories/create" element={<CategoryCreatePage />} />
        <Route path="/categories/:id/edit" element={<CategoryEditPage />} />

        {/* 表現 */}
        <Route path="/expressions" element={<ExpressionListPage />} />
        <Route path="/expressions/:id" element={<ExpressionDetailPage />} />
        <Route path="/expressions/create" element={<ExpressionCreatePage />} />
        <Route path="/expressions/:id/edit" element={<ExpressionEditPage />} />

        {/* お気に入り */}
        <Route path="/favorites" element={<FavoriteListPage />} />

        {/* バッジ */}
        <Route path="/badges" element={<BadgeListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
