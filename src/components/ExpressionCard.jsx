// 表現カード（一覧画面・お気に入り画面で共通利用）
import { Link } from "react-router-dom";

// 枠の色の数（index.css の .card-color-1〜8 と数をそろえる）
const CARD_COLOR_COUNT = 8;

// 日付を読める形にする
const formatHeardAt = (isoDateString) => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// カテゴリIDから色の番号（1〜8）を決める
// 例：ID 1 → 1番、ID 8 → 8番、ID 9 → また1番
// IDがない場合は 8番（グレー）にする（予備の色）
const getColorNumber = (categoryId) => {
  if (!categoryId) {
    return CARD_COLOR_COUNT;
  }
  return ((categoryId - 1) % CARD_COLOR_COUNT) + 1;
};

const ExpressionCard = ({ expression, onToggleFavorite, onDelete }) => {
  const colorNumber = getColorNumber(expression.speaker_category_id);

  // カテゴリ名（?. は「なければ undefined にする」書き方。エラー防止）
  const categoryName = expression.speaker_category?.name;

  return (
    // card-color-N のクラスで、枠とタグの色が変わる
    <div className={`expression-card card-color-${colorNumber}`}>
      <Link
        to={`/expressions/${expression.id}`}
        className="expression-card-link"
      >
        {/* カテゴリのタグ */}
        {categoryName && (
          <span className="expression-category-tag">{categoryName}</span>
        )}

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

      {/* ボタンをまとめる行 */}
      <div className="expression-card-actions">
        {/* お気に入り */}
        <button
          className="expression-favorite-button"
          onClick={(e) => onToggleFavorite(e, expression.id)}
        >
          {expression.is_favorite ? "❤ お気に入り" : "♡"}
        </button>

        {/* 削除ボタン：onDelete が渡されたときだけ表示 */}
        {onDelete && (
          <button
            className="expression-delete-button"
            onClick={(e) => onDelete(e, expression.id)}
          >
            削除
          </button>
        )}
      </div>
    </div>
  );
};

export default ExpressionCard;
