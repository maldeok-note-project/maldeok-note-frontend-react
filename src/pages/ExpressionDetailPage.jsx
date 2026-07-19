// 表現詳細
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../api/client";

// 日付
const formatHeardAt = (isoDateString) => {
  const date = new Date(isoDateString);
  return date.toLocalDateString("ja-JP", {
    // numeric:
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// 表現詳細画面
const ExpressionDetailPage = () => {
  // URLの「:id」部分取得
  const { id } = useParams();
  const [expression, setExpression] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffectでAPIからデータ取得
  useEffect(() => {
    const fetchExpressionDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1件取得
        const response = await apiClient.get(`/expressions/${id}`);
        // 一覧ページと同じく { data: {...} } / {...} どちらの形式でも対応
        const detail = response.data.data ?? response.data;
        setExpression(detail);

        // エラー処理
      } catch (err) {
        console.error("表現の取得に失敗しました。", err);
        setError("表現の取得に失敗しました。時間をおいて再度お試しください。");

        // finallyでローディング状態を解除
      } finally {
        setLoading(false);
      }
    };

    fetchExpressionDetail();
    // idが変わったら（別の詳細ページに移動したら）再取得
  }, [id]);

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
      <link to="/expressions">一覧に戻る</link>

      <h1 className="expression-phrase">{expression.phrase}</h1>
      <p className="expression-heard-at">
        📅{formatHeardAt(expression.heard_at)}
      </p>

      {/* お気に入り */}
      <p className="expression-favorite">
        {expression.is_favorite ? "❤" : "♡"}
      </p>

      <p className="expression-meaning">{expression.meaning}</p>
      <p className="expression-speaker-name">{expression.speaker_name}</p>

      {/* 場所 */}
      {expression.place && (
        <p className="expression-place">📍{expression.place}</p>
      )}

      {expression.note && <p className="expression-memo">{expression.memo}</p>}
    </div>
  );
};

export default ExpressionDetailPage;
