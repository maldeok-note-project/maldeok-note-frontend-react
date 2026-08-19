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
    <form onSubmit={handleSubmit}>
      {/* 全体エラー */}
      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

      {/* カテゴリ(エラー) */}
      {categoriesError && <p style={{ color: "red" }}>{categoriesError}</p>}

      {/* 0件の場合 */}
      {hasNoCategories && (
        <p style={{ color: "red" }}>
          カテゴリが登録されていないため、表現を登録できません。
          <br />
          まずはカテゴリを登録してください。
        </p>
      )}

      {/* 表現 */}
      <div>
        <label>表現</label>
        <input
          type="text"
          name="phrase"
          value={form.phrase}
          onChange={handleChange}
          placeholder="例: 잠 와"
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
          placeholder="例: 眠い"
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
        {isSubmitting ? `${submitLabel}中...` : submitLabel}
      </button>
    </form>
  );
};

export default ExpressionForm;
