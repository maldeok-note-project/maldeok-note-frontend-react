import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

const Header = () => {
  // ページ遷移用フック
  const navigate = useNavigate();

  // ハンバーガーメニューの開閉状態
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // リンクをクリックしたら閉じる（スマホ）
  const closeMenu = () => setIsMenuOpen(false);

  // 今いるページだけ強調
  const linkClass = ({ isActive }) =>
    `nav-link${isActive ? " active fw-bold" : ""}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <div className="container-fluid">
        {/* アプリ名 */}
        <NavLink className="navbar-brand" to="/expressions" onClick={closeMenu}>
          말덕노트
        </NavLink>

        {/* ハンバーガーボタン */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="メニューを切り替え"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* isMenuOpenの時showクラスが展開 */}
        <div
          className={`collapse navbar-collapse${isMenuOpen ? " show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto me-auto mb-2 mb-md-0">
            {/* 記録そのものの操作：一覧・作成 */}
            <li className="nav-item">
              <NavLink
                to="/expressions"
                className={linkClass}
                onClick={closeMenu}
              >
                一覧
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/expressions/create"
                className={linkClass}
                onClick={closeMenu}
              >
                作成
              </NavLink>
            </li>

            {/* 記録の裏方設定：カテゴリ */}
            <li className="nav-item">
              <NavLink
                to="/categories"
                className={linkClass}
                onClick={closeMenu}
              >
                カテゴリ
              </NavLink>
            </li>

            {/* 自分の記録を振り返る：お気に入り・バッジ */}
            <li className="nav-item">
              <NavLink
                to="/favorites"
                end
                className={linkClass}
                onClick={closeMenu}
              >
                お気に入り
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/badges" className={linkClass} onClick={closeMenu}>
                バッジ
              </NavLink>
            </li>
          </ul>

          {/* ログアウトボタン */}
          <button className="btn btn-outline-secondary" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
