// 表現フォーム
import { useEffect, useState } from "react";
import apiClient from "../api/client";

// propsで渡されたカテゴリ一覧を使ってフォームを表示するコンポーネント
const ExpressionForm = ({
  initialValues, // フォームの初期値(Editは取得済みデータ、Createは空)
  onSubmit, // 送信時に親へ渡すコールバック(親がPOST/PATCHを実行する)
  errors, // 親がAPIから受け取ったバリデーションエラー
  isSubmitting, // 親が管理する送信中フラグ
  submitLabel, // 送信ボタンの文言("登録" or "更新")
}) => {
  // フォーム内容
  const [form, setForm] = useState(initialValues);

  // カテゴリ一覧
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  // 画面表示とともにカテゴリ一覧を取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        const response = await apiClient.get("/speaker-categories");
        setCategories(response.data.data ?? []);
      } catch (error) {
        setCategoriesError("カテゴリ一覧の取得に失敗しました。");
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

    setForm((prev) => ({
      ...prev,

      // チェックボックスの場合はcheckedを使用
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // カテゴリーが0件の場合は登録できないようにする
  const hasNoCategories = !categoriesLoading && categories.length === 0;

  // フォーム送信処理
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="app-form">
      {/* 全体エラー */}
      {errors.general && <p className="app-form-error">{errors.general}</p>}

      {/* カテゴリ(エラー) */}
      {categoriesError && <p className="app-form-error">{categoriesError}</p>}

      {/* 0件の場合 */}
      {hasNoCategories && (
        <p className="app-form-error">
          カテゴリが登録されていないため、表現を登録できません。
          <br />
          まずはカテゴリを登録してください。
        </p>
      )}

      {/* 表現 */}
      <div className="app-form-group">
        <label>表現</label>
        <input
          type="text"
          name="phrase"
          value={form.phrase}
          onChange={handleChange}
          placeholder="例: 잠 와"
          className="app-form-input"
        />
        {errors.phrase && <p className="app-form-error">{errors.phrase}</p>}
      </div>

      {/* 意味 */}
      <div className="app-form-group">
        <label>意味</label>
        <input
          type="text"
          name="meaning"
          value={form.meaning}
          onChange={handleChange}
          placeholder="例: 眠い"
          className="app-form-input"
        />
        {errors.meaning && <p className="app-form-error">{errors.meaning}</p>}
      </div>

      {/* カテゴリ */}
      <div className="app-form-group">
        <label>カテゴリ</label>
        <select
          name="speaker_category_id"
          value={form.speaker_category_id}
          onChange={handleChange}
          disabled={categoriesLoading || hasNoCategories}
          className="app-form-input"
        >
          <option value="">選択してください</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.speaker_category_id && (
          <p className="app-form-error">{errors.speaker_category_id}</p>
        )}
      </div>

      {/* 名前 */}
      <div className="app-form-group">
        <label>名前</label>
        <input
          type="text"
          name="speaker_name"
          value={form.speaker_name}
          onChange={handleChange}
          placeholder="例：정한、IU"
          className="app-form-input"
        />
        {errors.speaker_name && (
          <p className="app-form-error">{errors.speaker_name}</p>
        )}
      </div>

      {/* 日付 */}
      <div className="app-form-group">
        <label>日付</label>
        <input
          type="date"
          name="heard_at"
          value={form.heard_at}
          onChange={handleChange}
          className="app-form-input"
        />
        {errors.heard_at && <p className="app-form-error">{errors.heard_at}</p>}
      </div>

      {/* 場所 */}
      <div className="app-form-group">
        <label>場所</label>
        <input
          type="text"
          name="place"
          value={form.place}
          onChange={handleChange}
          placeholder="例：カフェ"
          className="app-form-input"
        />
        {errors.place && <p className="app-form-error">{errors.place}</p>}
      </div>

      {/* メモ */}
      <div className="app-form-group">
        <label>メモ</label>
        <textarea
          name="memo"
          value={form.memo}
          onChange={handleChange}
          placeholder="会話の背景や思い出をメモ"
          className="app-form-input"
        />
        {errors.memo && <p className="app-form-error">{errors.memo}</p>}
      </div>

      {/* お気に入り */}
      <div className="app-form-group">
        <label className="app-form-checkbox-label">
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
      <button
        type="submit"
        disabled={isSubmitting || hasNoCategories}
        className="btn btn-primary"
      >
        {isSubmitting ? `${submitLabel}中...` : submitLabel}
      </button>
    </form>
  );
};

export default ExpressionForm;
