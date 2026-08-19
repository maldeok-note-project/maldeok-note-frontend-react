// 表現登録
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import ExpressionForm from "../components/ExpressionForm";

// 表現登録ページの
const ExpressionCreatePage = () => {
  const navigate = useNavigate();

  // バリデーションエラー
  const [errors, setErrors] = useState({});
  // 送信中フラグ
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 初期値
  const initialValues = {
    phrase: "",
    meaning: "",
    speaker_category_id: "",
    speaker_name: "",
    heard_at: "",
    place: "",
    memo: "",
    is_favorite: false,
  };

  // リクエスト送信
  const handleFormSubmit = async (form) => {
    setIsSubmitting(true);
    setErrors({});

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
      <ExpressionForm
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
        submitLabel="登録"
      />
    </div>
  );
};

export default ExpressionCreatePage;
