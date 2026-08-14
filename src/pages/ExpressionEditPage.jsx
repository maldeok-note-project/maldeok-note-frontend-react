// 表現編集
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/client";

// 編集画面
const ExpressionEditPage = () => {
  const navigate = useNavigate();
  // idを取得
  const { id } = useParams();

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
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  // データの取得状態
  const [expressionLoading, setExpressionLoading] = useState(true);
  const [expressionError, setExpressionError] = useState(null);

  // バリデーションエラー
  const [errors, setErrors] = useState({});

  // 送信中フラグ
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 画面表示とともにカテゴリ取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        const response = await apiClient.get("/speaker-categories");

        setCategories(response.data.data ?? []);
      } catch (error) {
        setCategoriesError("カテゴリの取得に失敗しました。", error);
        console.error(
          "カテゴリー一覧の取得に失敗しました。時間をおいて再度お試しください。",
          error,
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 画面表示とともに表現取得
  useEffect(() => {
    const fetchExpression = async () => {
      try {
        setExpressionLoading(true);
        setExpressionError(null);
        const response = await apiClient.get(`/expressions/${id}`);

        // 詳細ページと統一
        const data = response.data.data ?? response.data;

        // フォームにセット
        setForm({
          phrase: data.phrase,
          meaning: data.meaning,
          speaker_category_id: data.speaker_category_id,
          speaker_name: data.speaker_name,

          // 日付のフォーマットを整える
          heard_at: data.heard_at.slice(0, 10),
          place: data.place,
          memo: data.memo,
          is_favorite: data.is_favorite,
        });
      } catch (error) {
        setExpressionError("表現の取得に失敗しました。", error);
        console.error(
          "表現の取得に失敗しました。時間をおいて再度お試しください。",
          error,
        );
      } finally {
        setExpressionLoading(false);
      }
    };

    fetchExpression();
  }, [id]);

  // 入力値が変わるたびにフォーム内容を更新
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,

      // チェックボックスの場合はcheckedを使用
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // カテゴリ0件時は編集不可
  const hasNoCategories = !categoriesLoading && categories.length === 0;

  // データがそろうまでローディング表示
  const isPageLoading = categoriesLoading || expressionLoading;

  // 送信処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // 更新リクエスト送信
    try {
      await apiClient.patch(`/expressions/${id}`, {
        phrase: form.phrase,
        meaning: form.meaning,

        // 数値に変換
        speaker_category_id: Number(form.speaker_category_id),
        speaker_name: form.speaker_name,
        heard_at: form.heard_at,
        place: form.place,
        memo: form.memo,
        is_favorite: form.is_favorite,
      });

      // 詳細ページに遷移
      navigate(`/expressions/${id}`);
    } catch (error) {
      // 422=バリデーションエラー
      if (error.response?.data?.errors) {
        const rawErrors = error.response.data.errors;
        const formattedErrors = {};
        Object.keys(rawErrors).forEach((key) => {
          formattedErrors[key] = rawErrors[key][0];
        });
        setErrors(formattedErrors);
      } else if (error.response?.data?.message) {
        // 422以外のエラー
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({
          general: "表現の更新に失敗しました。時間をおいて再度お試しください。",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // データ取得失敗時は、フォーム自体を表示しない
  if (expressionError) {
    return (
      <div className="expression-edit-page">
        <p style={{ color: "red" }}>{expressionError}</p>
      </div>
    );
  }

  // どちらか一方が読み込み中の時
  if (isPageLoading) {
    return (
      <div className="expression-edit-page">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="expression-edit-page">
      <h1>表現編集</h1>

      {/* カテゴリ取得エラー */}
      {categoriesError && <p style={{ color: "red" }}>{categoriesError}</p>}

      {/* 0件 */}
      {hasNoCategories && (
        <p style={{ color: "red" }}>
          カテゴリが登録されていないため、表現の編集はできません。まずはカテゴリを登録してください。
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

        {/* カテゴリー */}
        <div>
          <label>種類</label>
          <select
            name="speaker_category_id"
            value={form.speaker_category_id}
            onChange={handleChange}
            disabled={hasNoCategories}
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

        {/* 送信中 or カテゴリー0件のときは押せない */}
        <button type="submit" disabled={isSubmitting || hasNoCategories}>
          {isSubmitting ? "更新中..." : "更新"}
        </button>
      </form>
    </div>
  );
};

export default ExpressionEditPage;
