// カテゴリ編集
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/client";

const CategoryEditPage = () => {
  // navigate: ページ遷移用の関数を取得
  const navigate = useNavigate();

  // カテゴリIDを取得
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
  });
  const [errors, setErrors] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 一覧取得からカテゴリを探して反映
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        // カテゴリ情報を取得
        const response = await apiClient.get(`/speaker-categories`);

        // レスポンス
        const categories = response.data.data;

        // 文字列→数値に変換して比較
        const category = categories.find((c) => c.id === Number(id));

        if (!category) {
          setFetchError(
            "指定されたカテゴリが見つかりませんでした。削除されたか、アクセス権がない可能性があります。",
          );
          return;
        }
        setForm({ name: category.name });
      } catch (error) {
        setFetchError(
          "カテゴリの取得に失敗しました。一覧画面に戻ってやり直してください。",
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchCategory();
  }, [id]);

  // フォームの入力値を更新
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrors({});

    try {
      // バックエンドにカテゴリ更新リクエストを送信
      await apiClient.patch(`/speaker-categories/${id}`, { name: form.name });

      // 更新成功時はカテゴリ一覧に遷移
      navigate("/categories");
    } catch (error) {
      // 422エラーの場合はバリデーションエラーを表示
      if (error.response?.data?.errors) {
        const rawErrors = error.response.data.errors;
        const formattedErrors = {};

        Object.keys(rawErrors).forEach((key) => {
          formattedErrors[key] = rawErrors[key][0];
        });
        setErrors(formattedErrors);

        // 409エラーの場合は競合エラーを表示
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({
          general: "カテゴリの更新に失敗しました。もう一度お試しください。",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return <p>読み込み中...</p>;
  }

  // カテゴリが見つからなかった場合のエラーメッセージを表示
  if (fetchError) {
    return <p style={{ color: "red" }}>{fetchError}</p>;
  }

  return (
    <div>
      <h1>カテゴリ編集</h1>

      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>カテゴリ名</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="例：SEVENTEEN、先生、친구"
          />

          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "更新中..." : "更新"}
        </button>
      </form>
    </div>
  );
};

export default CategoryEditPage;
