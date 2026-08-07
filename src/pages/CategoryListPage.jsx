// カテゴリ一覧
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";

// 登録日を読める形にする
const formatCreatedAt = (isoDateString) => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// カテゴリ一覧
const CategoryListPage = () => {
  // データを入れる箱
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // api呼び出し
        const response = await apiClient.get("/speaker-categories");

        // レスポンス対応
        const list = response.data.data ?? response.data;
        setCategories(list);
      } catch (err) {
        console.error("カテゴリ一覧の取得に失敗しました。", err);
        setError(
          "カテゴリ一覧の取得に失敗しました。時間をおいて再度お試しください。",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ブラウザ分岐
  if (loading) {
    return <div>読み込み中...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (categories.length === 0) {
    return (
      <div>
        まだ登録されたカテゴリがありません。最初のカテゴリを作成してみましょう！
      </div>
    );
  }

  return (
    <div className="category-list-page">
      <h1>カテゴリ一覧</h1>

      <div className="category-card-list">
        {/* バックエンドから返ってきた順番のまま表示 */}
        {categories.map((category) => (
          // 今回のブランチは表示のみの仕様
          // 後のブランチで編集・削除ボタンを追加する
          <div className="category-card" key={category.id}>
            <p className="category-name">{category.name}</p>
            <p className="category-created-at">
              登録日: {formatCreatedAt(category.created_at)}
            </p>
            <Link to={`/categories/${category.id}/edit`}>編集</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryListPage;
