// 表現編集
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/client";
import ExpressionForm from "../components/ExpressionForm";

// 編集ページ
const ExpressionEditPage = () => {
  const navigate = useNavigate();
  // idを取得
  const { id } = useParams();

  // APIから取得した既存データ
  const [initialValues, setInitialValues] = useState();

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
        const response = await apiClient.get(`/speaker-categories/${id}`);
        const data = response.data.data ?? response.data;

        // ExpressionFormに渡す初期値としてセット
        setInitialValues({
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
        setCategoriesError("カテゴリの取得に失敗しました。");
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

  // リクエスト送信
  const handleFormSubmit = async (form) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      await apiClient.patch(`/expressions/${id}`, {
        phrase: form.phrase,
        meaning: form.meaning,
        speaker_category_id: Number(form.speaker_category_id),
        speaker_name: form.speaker_name,
        heard_at: form.heard_at,
        place: form.place,
        memo: form.memo,
        is_favorite: form.is_favorite,
      });

      // 更新後に詳細ページへ遷移
      navigate(`/expressions/${id}`);
    } catch (error) {
      // 422エラーの場合はバリデーションエラーとして処理
      if (error.response?.data?.errors) {
        const rawErrors = error.response.data.errors;
        const formattedErrors = {};
        Object.keys(rawErrors).forEach((key) => {
          formattedErrors[key] = rawErrors[key][0];
        });
        setErrors(formattedErrors);
      } else if (error.response?.data?.message) {
        // それ以外のエラーの場合はメッセージを表示
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

  // データ取得失敗時(フォーム自体を表示しない)
  if (expressionError) {
    return (
      <div className="expression-edit-page">
        <p style={{ color: "red" }}>{expressionError}</p>
      </div>
    );
  }

  // 取得中
  if (expressionLoading) {
    return (
      <div className="expression-edit-page">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="expression-edit-page">
      <h1>表現編集</h1>

      <ExpressionForm
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
        submitLabel="更新" // 送信ボタンの文言
      />
    </div>
  );
};

export default ExpressionEditPage;
