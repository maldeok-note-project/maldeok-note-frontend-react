// 表現カード（一覧画面・お気に入り画面で共通利用）
import { Link } from "react-router-dom";

// 日付を読める形にする
const formatHeardAt = (isoDateString) => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// props：親画面から受け取る情報
// - expression：表現1件分のデータ
// - onToggleFavorite：♡ボタンを押したときの処理
// - onDelete：削除ボタンの処理（渡されたときだけ削除ボタンを表示）
const ExpressionCard = ({ expression, onToggleFavorite, onDelete }) => {
  return (
    <div className="expression-card">
      <Link
        to={`/expressions/${expression.id}`}
        className="expression-card-link"
      >
        {/* 表現 */}
        <p className="expression-phrase">{expression.phrase}</p>

        {/* 意味 */}
        <p className="expression-meaning">{expression.meaning}</p>

        {/* 誰が言ったか */}
        <p className="expression-speaker-name">{expression.speaker_name}</p>

        {/* 日付 */}
        <p className="expression-heard-at">
          {formatHeardAt(expression.heard_at)}
        </p>
      </Link>

      {/* お気に入り */}
      <button
        className="expression-favorite-button"
        onClick={(e) => onToggleFavorite(e, expression.id)}
      >
        {expression.is_favorite ? "❤ お気に入り" : "♡"}
      </button>

      {/* 削除ボタン：onDelete が渡されたときだけ表示 */}
      {onDelete && (
        <button onClick={(e) => onDelete(e, expression.id)}>削除</button>
      )}
    </div>
  );
};

export default ExpressionCard;
