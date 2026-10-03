// 表現詳細
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { toggleFavorite } from "../api/expressionActions";
import ConfirmModal from "../components/ConfirmModal";

// 日付
const formatHeardAt = (isoDateString) => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString("ja-JP", {
    // numeric: JSに用意されている日付フォーマットのオプション
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// 表現詳細画面
const ExpressionDetailPage = () => {
  const navigate = useNavigate();
  // URLの「:id」部分取得
  const { id } = useParams();

  // データを入れる箱たち
  const [expression, setExpression] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 画面が表示されたタイミング、もしくは id が変わったタイミングで実行
  useEffect(() => {
    // async/await で非同期処理を実行するための関数を定義
    const fetchExpressionDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1件取得(するまで待つ)
        const response = await apiClient.get(`/expressions/${id}`);
        // 一覧ページと同じく { data: {...} } / {...} どちらの形式でも対応
        const detail = response.data.data ?? response.data;
        setExpression(detail);

        // エラー処理
      } catch (error) {
        console.error("表現の取得に失敗しました。", error);
        setError("表現の取得に失敗しました。時間をおいて再度お試しください。");

        // finallyでローディング状態を解除
      } finally {
        setLoading(false);
      }
    };
    // 定義した関数を実行(呼び出し)
    fetchExpressionDetail();
    // idが変わったら（別の詳細ページに移動したら）再取得
  }, [id]);

  // お気に入りON/OFF
  const handleToggleFavorite = async () => {
    try {
      const updated = await toggleFavorite(id);

      setExpression((prevExpression) => ({
        ...prevExpression,
        is_favorite: updated.is_favorite,
      }));
    } catch (error) {
      console.error("お気に入りの更新に失敗しました。", error);
      alert("お気に入りの更新に失敗しました。時間をおいて再度お試しください。");
    }
  };

  // 削除ボタンを押した時：ポップアップを表示するだけ
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  // ポップアップの「削除する」を押した時：実際に削除する
  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);

    try {
      await apiClient.delete(`/expressions/${id}`);
      navigate("/expressions");
    } catch (error) {
      console.error("表現の削除に失敗しました。", error);
      alert("表現の削除に失敗しました。時間をおいて再度お試しください。");
    }
  };

  // ブラウザ分岐
  if (loading) {
    return <div>読み込み中...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (!expression) {
    return <div>表現が見つかりませんでした。</div>;
  }

  return (
    <div className="expression-detail-page">
      <Link to="/expressions">一覧に戻る</Link>

      <h1 className="expression-phrase">{expression.phrase}</h1>
      <p className="expression-heard-at">
        📅{formatHeardAt(expression.heard_at)}
      </p>

      <p className="expression-meaning">{expression.meaning}</p>

      {/* カテゴリ名：話者名 */}
      <p className="expression.speaker">
        {expression.speaker_category?.name} : {expression.speaker_name}
      </p>

      {/* 場所 */}
      {/* 「もし〜だったら表示する」Reactでよく使う短縮の書き方 */}
      {expression.place && (
        <p className="expression-place">📍{expression.place}</p>
      )}

      {expression.memo && <p className="expression-memo">{expression.memo}</p>}

      {/* お気に入り・編集・削除 */}
      <div className="expression-detail-actions">
        <button
          className="expression-favorite-button"
          onClick={handleToggleFavorite}
        >
          {expression.is_favorite ? "❤" : "♡"}
        </button>

        <Link
          to={`/expressions/${id}/edit`}
          className="expression-detail-edit-button"
        >
          編集
        </Link>

        <button
          className="expression-delete-button"
          onClick={handleDeleteClick}
        >
          削除
        </button>
      </div>
    </div>
  );
};

export default ExpressionDetailPage;
