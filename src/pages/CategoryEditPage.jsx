// カテゴリ編集
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../apiClient";

const CategoryEditPage = () => {
  // navigate: ページ遷移用の関数を取得
  const navigate = useNavigate();

  // カテゴリIDを取得
  const { id } = useParams();

  const [from, setFrom] = useState({
    name: "",
  });
  const [error, setError] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await apiClient.get(`/categories/${id}`);
        setForm({ name: response.data.name });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError({});

    try {
      await apiClient.put(`/categories/${id}`, {
        name: form.name,
      });
      // 更新成功時はカテゴリ一覧に遷移
      navigate("/categories");
    } catch (error) {
      if (error.response?.data?.errors) {
        const rawErrors = error.response.data.errors;
        const formattedErrors = {};

        Object.keys(rawErrors).forEach((key) => {
          formattedErrors[key] = rawErrors[key][0];
        });
        setError(formattedErrors);
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
