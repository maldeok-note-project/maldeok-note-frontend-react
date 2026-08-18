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

  // 検索キーワードの箱
  const [searchKeyword, setSearchKeyword] = useState("");

  // 絞り込み条件の箱
  const [categories, setCategories] = useState([]);

  // 現在選択中のカテゴリID
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // 表現一覧を取得する関数
  const fetchExpression = async (keyword = "", categoryId = "") => {
    try {
      setLoading(true);
      setError(null);

      // 検索キーワードと絞り込み条件を「AND」でAPIに渡す
      const params = {};
      if (keyword) {
        params.search = keyword;
      }
      if (categoryId) {
        params.speaker_category_id = categoryId;
      }

      // api呼び出し
      const response = await apiClient.get("/expressions", { params });

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

  // ドロップダウンのカテゴリ一覧を取得する関数
  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/speaker-categories");
      const list = response.data.data ?? response.data;
      setCategories(list);
    } catch (error) {
      // エラー処理
      console.error("カテゴリ一覧の取得に失敗しました。", error);
    }
  };

  // useEffect：画面が最初に表示されたタイミングで一度だけ実行される
  useEffect(() => {
    fetchExpression();
    fetchCategories();
  }, []);

  // 検索フォームの送信時
  const handleSearchSubmit = (e) => {
    // 再読み込み防止
    e.preventDefault();

    // 現在の入力値で検索
    fetchExpression(searchKeyword, selectedCategoryId);
  };

  // カテゴリ選択時
  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    setSelectedCategoryId(newCategoryId);

    // 変更時に再取得
    fetchExpression(searchKeyword, newCategoryId);
  };

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
      await fetchExpression(searchKeyword, selectedCategoryId);
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

  return (
    <div className="expression-list-page">
      <h1>言葉の記録帳</h1>

      {/* 検索フォーム */}
      <form onSubmit={handleSearchSubmit} className="expression-search-form">
        <input
          type="text"
          // searchKeywordの値を表示
          value={searchKeyword}
          // onChangeで入力値をstateに反映
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="表現・意味を検索"
        />

        {/* カテゴリ絞り込みドロップダウン */}
        <select value={selectedCategoryId} onChange={handleCategoryChange}>
          <option value="">すべてのカテゴリ</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit">検索</button>
      </form>

      {expressions.length === 0 ? (
        <div>
          {searchKeyword
            ? // 検索キーワードがある場合
              "検索結果が見つかりませんでした。別のキーワードでお試しください。"
            : // 検索キーワードが空の場合
              "表現が登録されていません。最初の一言を残してみましょう！"}
        </div>
      ) : (
        // 表現カードリスト
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
      )}
    </div>
  );
};

export default ExpressionListPage;
