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
        <Route path="/categiries" element={<CategoryListPage />} />
        <Route path="/categiries/create" element={<CategoryCreatePage />} />
        <Route path="/categiries/:id/edit" element={<CategoryEditPage />} />

        {/* 表示 */}
        <Route path="/expressions" element={<ExpressionListPagePage />} />
        <Route path="/expressions/:id" element={<ExpressionDetailPage />} />
        <Route path="/expressions/create" element={<ExpressionCreatePage />} />
        <Route path="/expressions/:id/edit" element={<ExpressionEditPage />} />

        {/* お気に入り */}
        <Route path="/favorite" element={<FavoriteListPage />} />

        {/* バッジ */}
        <Route path="/badge" element={<BadgeListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
