// お気に入り
import { useEffect, useState } from "react";
import apiClient from "../api/client";
import ExpressionCard from "../components/ExpressionCard";
import { toggleFavorite } from "../api/expressionActions";

const FavoriteListPage = () => {
  const [expressions, setExpressions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavoriteExpressions = async () => {
    try {
      setLoading(true);
      setError(null);

      // お気に入りだけ取得
      const response = await apiClient.get("expressions", {
        // 自動でURLを組み立ててくれる
        params: { is_favorite: "true" },
      });

      // 一覧ページと同じく { data: {...} } / {...} どちらの形式でも対応
      const list = response.data.data ?? response.data;
      setExpressions(list);
    } catch (error) {
      console.error("お気に入り一覧の取得に失敗しました。", error);
      setError(
        "お気に入り一覧の取得に失敗しました。時間をおいて再度お試しください。",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteExpressions();
  }, []);

  // お気に入りON/OFF
  // 再読み込みで更新が反映
  const handleToggleFavorite = async (e, id) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const updated = await toggleFavorite(id);

      setExpressions((prevExpressions) =>
        prevExpressions.map((expression) =>
          expression.id === id
            ? { ...expression, is_favorite: updated.is_favorite }
            : expression,
        ),
      );
    } catch (error) {
      console.error("お気に入りの更新に失敗しました。", error);
      alert("お気に入りの更新に失敗しました。時間をおいて再度お試しください。");
    }
  };

  // ブラウザ分岐
  if (loading) {
    return <div>読み込み中...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (expressions.length === 0) {
    return <div>お気に入りに登録された表現がありません。</div>;
  }

  return (
    <div className="favorite-list-page">
      <h1>お気に入りコレクション</h1>

      <div className="expression-card-list">
        {expressions.map((expression) => (
          // onDelete を渡さない → 削除ボタンは出ない（今までと同じ動き）
          <ExpressionCard
            key={expression.id}
            expression={expression}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoriteListPage;
