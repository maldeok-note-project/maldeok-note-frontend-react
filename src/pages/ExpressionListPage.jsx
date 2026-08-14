// 表現一覧
import { useEffect, useState } from "react";
import apiClient from "../api/client";
import { Link } from "react-router-dom";
import { toggleFavorite } from "../api/expressionActions";

// 日付を読める形にする
const formatHeardAt = (isoDateString) => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ExpressionListPage = () => {
  // 表現を入れる箱
  const [expressions, setExpressions] = useState([]);

  // 「読み込み中...」の表示の箱
  const [loading, setLoading] = useState(true);

  // エラー時の箱
  const [error, setError] = useState(null);
  const fetchExpression = async () => {
    try {
      setLoading(true);
      setError(null);

      // api呼び出し
      const response = await apiClient.get("/expressions");

      // バックエンドのレスポンス形式が
      // { data: [...] } でも [...] そのままでも対応
      const list = response.data.data ?? response.data;

      setExpressions(list);
    } catch (error) {
      console.error("表現一覧の取得に失敗しました。", error);
      setError("表現の取得に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  // useEffect：画面が最初に表示されたタイミングで一度だけ実行される
  useEffect(() => {
    fetchExpression();
  }, []);

  // お気に入りON/OFF
  const handleToggleFavorite = async (e, id) => {
    // 伝播防止
    e.stopPropagation();
    e.preventDefault();

    try {
      const updated = await toggleFavorite(id);

      // 更新後のデータで置き換え
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

  // 削除処理
  const handleDelete = async (e, id) => {
    // 伝播防止
    e.stopPropagation();

    // 確認ダイアログ
    if (!window.confirm("この表現を削除しますか？")) {
      return;
    }

    try {
      await apiClient.delete(`/expressions/${id}`);

      // 削除後に一覧を再取得
      await fetchExpression();
    } catch (error) {
      console.error("表現の削除に失敗しました。", error);
      alert("表現の削除に失敗しました。時間をおいて再度お試しください。");
    }
  };

  // ブラウザ表示部分分岐
  if (loading) {
    return <div>読み込み中...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (expressions.length === 0) {
    return (
      <div>まだ登録された表現がありません。最初の一言を残してみましょう！</div>
    );
  }

  return (
    <div className="expression-list-page">
      <h1>言葉の記録帳</h1>

      <div className="expression-card-list">
        {expressions.map((expression) => (
          <div className="expression-card" key={expression.id}>
            <Link
              to={`/expressions/${expression.id}`}
              className="expression-card-link"
            >
              {/* 表現 */}
              <p className="expression-phrase">{expression.phrase}</p>

              {/* 意味 */}
              <p className="expression-meaning">{expression.meaning}</p>

              {/* 誰が言ったか */}
              <p className="expression-speaker-name">
                {expression.speaker_name}
              </p>

              {/* 日付 */}
              <p className="expression-heard-at">
                {formatHeardAt(expression.heard_at)}
              </p>
            </Link>

            {/* お気に入り（表示のみ） */}
            <button
              className="expression-favorite-button"
              onClick={(e) => handleToggleFavorite(e, expression.id)}
            >
              {expression.is_favorite ? "❤ お気に入り" : "♡"}
            </button>

            {/* 削除ボタン */}
            <button onClick={(e) => handleDelete(e, expression.id)}>
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpressionListPage;
