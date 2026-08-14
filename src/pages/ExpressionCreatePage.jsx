// 表現登録
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

// 表現登録
const ExpressionCreatePage = () => {
  const navigate = useNavigate();

  // フォーム内容
  const [form, setForm] = useState({
    phrase: "",
    meaning: "",
    speaker_category_id: "",
    speaker_name: "",
    heard_at: "",
    place: "",
    memo: "",
    is_favorite: false,
  });

  // カテゴリ一覧
  const [categories, setCategories] = useState([]);

  // 取得中かどうか
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  // バリデーションエラー
  const [errors, setErrors] = useState({});

  // 送信中フラグ
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 画面表示とともにカテゴリ一覧を取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        const response = await apiClient.get("/speaker-categories");

        setCategories(response.data.data ?? []);
      } catch (error) {
        setCategoriesError("カテゴリ一覧の取得に失敗しました。", error);
        console.error(
          "カテゴリ一覧の取得に失敗しました。時間をおいて再度お試しください。",
          error,
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 入力値が変わるたびにフォーム内容を更新
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // チェックボックスの場合はcheckedを使用
    setForm((prev) => ({
      ...prev,
      // それ以外はvalueを使用
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // カテゴリーが0件の場合は登録できないようにする
  const hasNoCategories = !categoriesLoading && categories.length === 0;

  //フォーム送信処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // 表現を新規作成するリクエストを送信
    try {
      const response = await apiClient.post("/expressions", {
        phrase: form.phrase,
        meaning: form.meaning,
        // 数値変換
        speaker_category_id: Number(form.speaker_category_id),
        speaker_name: form.speaker_name,
        heard_at: form.heard_at,
        place: form.place,
        memo: form.memo,
        is_favorite: form.is_favorite,
      });

      // 作成されたIDを取得
      const newExpressionId = response.data.data.id;

      // 作成後に詳細ページへ遷移
      navigate(`/expressions/${newExpressionId}`);
    } catch (error) {
      // 422エラーの場合はバリデーションエラーとして処理
      if (error.response?.data?.errors) {
        const rawErrors = error.response.data.errors;
        const formatedErrors = {};
        Object.keys(rawErrors).forEach((key) => {
          formatedErrors[key] = rawErrors[key][0];
        });
        setErrors(formatedErrors);
      } else if (error.response?.data?.message) {
        // それ以外のエラーの場合はメッセージを表示
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({
          general: "表現の登録に失敗しました。時間をおいて再度お試しください。",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="expression-create-page">
      <h1>表現登録</h1>

      {/* カテゴリ取得エラー */}
      {categoriesError && <p style={{ color: "red" }}>{categoriesError}</p>}

      {/* 0件の場合 */}
      {hasNoCategories && (
        <p style={{ color: "red" }}>
          カテゴリが登録されていないため、表現を登録できません。先にカテゴリを登録してください。
        </p>
      )}

      {/* 全体エラー */}
      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

      <form onSubmit={handleSubmit}>
        {/* 表現 */}
        <div>
          <label>表現</label>
          <input
            type="text"
            name="phrase"
            value={form.phrase}
            onChange={handleChange}
            placeholder="例：잠 와"
          />
          {errors.phrase && <p style={{ color: "red" }}>{errors.phrase}</p>}
        </div>

        {/* 意味 */}
        <div>
          <label>意味</label>
          <input
            type="text"
            name="meaning"
            value={form.meaning}
            onChange={handleChange}
            placeholder="例：眠い"
          />
          {errors.meaning && <p style={{ color: "red" }}>{errors.meaning}</p>}
        </div>

        {/* カテゴリ */}
        <div>
          <label>カテゴリ</label>
          <select
            name="speaker_category_id"
            value={form.speaker_category_id}
            onChange={handleChange}
            disabled={categoriesLoading || hasNoCategories}
          >
            <option value="">選択してください</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.speaker_category_id && (
            <p style={{ color: "red" }}>{errors.speaker_category_id}</p>
          )}
        </div>

        {/* 名前 */}
        <div>
          <label>名前</label>
          <input
            type="text"
            name="speaker_name"
            value={form.speaker_name}
            onChange={handleChange}
            placeholder="例：정한、IU"
          />
          {errors.speaker_name && (
            <p style={{ color: "red" }}>{errors.speaker_name}</p>
          )}
        </div>

        {/* 日付 */}
        <div>
          <label>日付</label>
          <input
            type="date"
            name="heard_at"
            value={form.heard_at}
            onChange={handleChange}
          />
          {errors.heard_at && <p style={{ color: "red" }}>{errors.heard_at}</p>}
        </div>

        {/* 場所 */}
        <div>
          <label>場所</label>
          <input
            type="text"
            name="place"
            value={form.place}
            onChange={handleChange}
            placeholder="例：カフェ"
          />
          {errors.place && <p style={{ color: "red" }}>{errors.place}</p>}
        </div>

        {/* メモ */}
        <div>
          <label>メモ</label>
          <textarea
            name="memo"
            value={form.memo}
            onChange={handleChange}
            placeholder="会話の背景や思い出をメモ"
          />
          {errors.memo && <p style={{ color: "red" }}>{errors.memo}</p>}
        </div>

        {/* お気に入り */}
        <div>
          <label>
            <input
              type="checkbox"
              name="is_favorite"
              checked={form.is_favorite}
              onChange={handleChange}
            />
            お気に入りに登録する
          </label>
        </div>

        {/* 送信ボタン：送信中 or カテゴリー0件のときは押せない */}
        <button type="submit" disabled={isSubmitting || hasNoCategories}>
          {isSubmitting ? "登録中..." : "登録"}
        </button>
      </form>
    </div>
  );
};

export default ExpressionCreatePage;
