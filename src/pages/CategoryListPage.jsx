// カテゴリ一覧
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import ConfirmModal from "../components/ConfirmModal";

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

  // 削除確認モーダルの表示状態の箱
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // api呼び出し
      const response = await apiClient.get("/speaker-categories");

      // レスポンス対応
      const list = response.data.data ?? response.data;
      setCategories(list);
    } catch (error) {
      console.error("カテゴリ一覧の取得に失敗しました。", error);
      setError(
        "カテゴリ一覧の取得に失敗しました。時間をおいて再度お試しください。",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 削除ボタンを押した時：ポップアップを表示するだけ
  const handleDeleteClick = (categoryId) => {
    setDeleteTargetId(categoryId);
    setShowDeleteModal(true);
  };

  // ポップアップの「削除する」を押した時：実際に削除する
  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);

    try {
      await apiClient.delete(`/speaker-categories/${deleteTargetId}`);
      // 削除後にカテゴリ一覧を再取得
      await fetchCategories();
    } catch (error) {
      console.error("カテゴリ削除に失敗しました。", error);

      // 409エラーの場合は、削除できない旨を表示
      if (error.response?.status === 409) {
        alert(error.response.data.message);
      } else {
        alert("カテゴリ削除に失敗しました。時間をおいて再度お試しください。");
      }
    }
  };

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
        <p>
          まだ登録されたカテゴリがありません。最初のカテゴリを作成してみましょう！
        </p>
        <Link to="/categories/create" className="btn btn-primary">
          新規カテゴリを作成
        </Link>
      </div>
    );
  }

  return (
    <div className="category-list-page">
      <h1>カテゴリ一覧</h1>
      <Link to="/categories/create" className="btn btn-primary mb-3">
        新規カテゴリを作成
      </Link>

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
            <button onClick={() => handleDeleteClick(category.id)}>削除</button>
          </div>
        ))}
      </div>

      {/* 削除確認モーダル */}
      <ConfirmModal
        show={showDeleteModal}
        message="本当に削除しますか？"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default CategoryListPage;
