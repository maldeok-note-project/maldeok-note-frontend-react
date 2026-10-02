import { Navigate, replace } from "react-router-dom";
import Header from "./Header";

// 未ログイン者を弾く
const AuthGuard = ({ children }) => {
  // ストレージからトークン取得
  const token = localStorage.getItem("token");

  // トークンが無ければログイン画面へ
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // トークンがあれば継続
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default AuthGuard;
