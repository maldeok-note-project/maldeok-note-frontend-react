// カテゴリ作成
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

// カテゴリ作成ページ
const CategoryCreatePage = () => {
  const navigate = useNavigate();

  // カテゴリ名の箱
  const [form, setForm] = useState({
    name: "",
  });

  // エラー管理
  const [errors, setErrors] = useState({});

  // 送信中フラグ
  const [isLoading, setIsLoading] = useState(false);

  // 入力値が変わるたびに更新
  const handleChange = (e) => {
    const { name, value } = e.target;
    // prev: 更新される直前の、今のform の中身
    // ...: 中身を全部コピー(スプレッド構文)
    // [name]: value: name(key)の中身をvalueに更新
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    // preventDefault：リロード防止
    e.preventDefault();

    setIsLoading(true);
    setErrors({});

    try {
      // バックエンドへカテゴリ作成リクエストを送信
      await apiClient.post("/speaker-categories", {
        name: form.name,
      });

      // 成功したらカテゴリ一覧ページへ遷移
      navigate("/categories");
    } catch (error) {
      // バックエンドからのエラーレスポンスを取得
      // 422（バリデーションエラー）: オブジェクトあり
      if (error.response?.data?.errors) {
        const rawErrors = error.response.data.errors;
        const formattedErrors = {};
        Object.keys(rawErrors).forEach((key) => {
          formatted[key] = rawErrors[key][0];
        });
        // 409（重複エラー）: オブジェクトなし、messageあり
        setError(formattedErrors);
      } else if (error.response?.data?.message) {
        setErrors({
          general: error.response.data.message,
        });
      } else {
        setErrors({
          general: "カテゴリの作成に失敗しました。もう一度お試しください。",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // カテゴリ作成ページ
  return (
    <div>
      <h1>カテゴリ作成</h1>

      {/* 全体エラー */}
      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

      {/* 入力フィールド */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>カテゴリ名</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="例：SEVENTEEN、정한、キムせんせい"
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>

        {/* 送信ボタン */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "登録中..." : "登録"}
        </button>
      </form>
    </div>
  );
};

export default CategoryCreatePage;
