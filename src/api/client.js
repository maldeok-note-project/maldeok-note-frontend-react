import axios from "axios";

// axiosインスタンス作成
const apiClient = axios.create({
  // バックエンドのベースURL
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // req, res共にJSON形式で通信
  headers: {
    "Content-Type": "application/json",
  },
});

// リクエストインターセプター
// JWTをヘッダーに自動付与
apiClient.interceptors.request.use((config) => {
  // ストレージからJWTトークン取得
  const token = localStorage.getItem("token");

  // トークンがあればAuthorizationヘッダーにセット
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
