// カードの色に関する、共通ロジック
// 表現カード・表現詳細ページ、両方から使う

// 枠の色の数（index.css の .card-color-1〜8 と数をそろえる）
export const CARD_COLOR_COUNT = 8;

// カテゴリIDから色の番号（1〜8）を決める
// 例：ID 1 → 1番、ID 8 → 8番、ID 9 → また1番
// IDがない場合は 8番（グレー）にする（予備の色）
export const getColorNumber = (categoryId) => {
  if (!categoryId) {
    return CARD_COLOR_COUNT;
  }
  return ((categoryId - 1) % CARD_COLOR_COUNT) + 1;
};
