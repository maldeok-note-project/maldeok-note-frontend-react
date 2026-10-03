import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

// 会員登録
const RegidterPage = () => {
  const navigate = useNavigate();

  // フォームの入力値を管理
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "", // フロントのみ使用
  });

  // エラーメッセージ管理
  const [errors, setErrors] = useState({});

  // 送信中フラグ（二重送信防止）
  const [isLoading, setIsLoading] = useState(false);

  // 入力値が変わるたびに更新
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 送信ボタンを押したときの処理
  const handleSubmit = async (e) => {
    e.preventDefault(); // リロード防止

    // パスワード確認（フロントのみ）
    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: "パスワードが一致しません" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    // バックエンドへ登録リクエスト
    try {
      await apiClient.post("/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // 成功後ログイン画面
      navigate("/login");
    } catch (error) {
      // バックエンドからのエラーレスポンス処理
      if (error.response?.data?.errors) {
        const rawErrors = error.response.data.errors;
        const formatted = {};
        Object.keys(rawErrors).forEach((key) => {
          formatted[key] = rawErrors[key][0];
        });
        setErrors(formatted);
      } else {
        setErrors({ general: "登録に失敗しました。もう一度お試しください。" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 会員登録ページ
  return (
    <div>
      <h1>会員登録</h1>

      {/* 全体エラー */}
      {errors.general && <p className="app-form-error">{errors.general}</p>}

      {/* フォーム */}
      <form onSubmit={handleSubmit} className="app-form">
        <div className="app-form-group">
          <label>말덕ネーム</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="app-form-input"
          />
          {errors.name && (
            <p className="app-form-error">말덕ネームは必須です。</p>
          )}
        </div>

        <div className="app-form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="app-form-input"
          />
          {errors.email && <p className="app-form-error">{errors.email}</p>}
        </div>

        <div className="app-form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="app-form-input"
          />
          {errors.password && (
            <p className="app-form-error">{errors.password}</p>
          )}
        </div>

        <div className="app-form-group">
          <label>Password(check)</label>
          <input
            type="password"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            className="app-form-input"
          />
          {errors.password_confirmation && (
            <p className="app-form-error">{errors.password_confirmation}</p>
          )}
        </div>

        {/* 送信ボタン */}
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? "登録中..." : "登録する"}
        </button>
      </form>
    </div>
  );
};

export default RegidterPage;
