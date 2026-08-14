// 表現関連のAPI呼び出しまとめ
// 一覧画面・詳細画面などの共通関数
import apiClient from "./client";

// お気に入りON/OFF
export const toggleFavorite = async (id) => {
  const response = await apiClient.post(`/expressions/${id}/favorite`);

  // 更新後の表現
  return response.data.data ?? response.data;
};
