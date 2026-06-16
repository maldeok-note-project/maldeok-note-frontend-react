import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

const Header = () => {
  // ページ遷移用フック
  const navigate = useNavigate();

  // ログアウト処理
  const handleLogout = async () => {
    // バックエンドのAPIを叩く
    try {
      await logout();
    } catch (e) {
      // APIが失敗しても処理続行
      console.error("ログアウトAPIエラー", e);
    } finally {
      // JWTをストレージから削除
      localStorage.removeItem("token");
      // TOPへ戻る
      navigate("/");
    }
  };

  return (
    <header>
      <span>말덕노트</span>
      <button onClick={handleLogout}>ログアウト</button>
    </header>
  );
};
