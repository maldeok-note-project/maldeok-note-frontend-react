import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

// ログイン
const LoginPage = () => {
  const navigate = useNavigate();

  // 入力値管理
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // エラー管理
  const [errors, setErrors] = useState({});

  // 二重送信防止
  const [isLoading, setIsLoading] = useState(false);

  // 入力値が変わるたびに更新
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ボタンを押した後の処理
  const handleSubmit = async (e) => {
    e.preventDefault(); // リロード防止

    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiClient.post("/login", {
        email: form.email,
        password: form.password,
      });

      // JWTトークンをストレージに保存
      localStorage.setItem("token", response.data.token);

      // 一覧画面へ変遷
      navigate("/expressions");
    } catch (error) {
      // バックエンドからエラーレスポンス処理
      if (errors.response?.data?.error) {
        const rawErrors = error.response.data.errors;
        const formatted = {};
        Object.keys(rawErrors).forEach((key) => {
          formatted[key] = rawErrors[key][0];
        });
        setErrors(formatted);
      } else {
        setErrors({ general: "EmailまたはPasswordが正しくありません。" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>ログイン</h1>

      {/* 全体エラー */}
      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

      {/* フォーム */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.emal}
            onChange={handleChange}
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>

        {/* 送信ボタン */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
