// トップページ（アプリ説明・ログイン導線）
import { Link } from "react-router-dom";

const TopPage = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      {/* アプリ名 */}
      <h1 className="mb-3">말덕노트</h1>

      {/* キャッチコピー */}
      <p className="lead mb-2 catch-copy">推しや友達の生の韓国語を記録しよう</p>

      {/* 説明 */}
      <p className="text-muted mb-4">
        「말덕노트」は、推しや友達などの、現地人が使う韓国語を記録するためのアプリです。
        <br />
        日常で耳にした韓国語を「いつ」「どこで」「誰が」使ったかを、簡単に登録できます。
      </p>

      {/* ボタンエリア */}
      <div className="d-flex gap-3">
        <Link to="/login" className="btn btn-primary">
          新規登録
        </Link>
        <Link to="/login" className="btn btn-outline-primary">
          ログイン
        </Link>
      </div>
    </div>
  );
};

export default TopPage;
