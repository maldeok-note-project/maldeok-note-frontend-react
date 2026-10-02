// バッジ一覧
import { useEffect, useState } from "react";
import apiClient from "../api/client";
import BadgeCard from "../components/BadgeCard";

const BadgeListPage = () => {
  // 三状態パターン：読み込み中 / エラー / データ
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // つき合わせ済みバッジ一覧
  const [badges, setBadges] = useState([]);
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        setError(null);

        // ３つのAPI呼び出し
        const [allBadgesRes, myBadgesRes, expressionsRes] = await Promise.all([
          apiClient.get("/badges"),
          apiClient.get("/badges/my"),
          apiClient.get("/expressions"),
        ]);

        // badges, badges/myは直接返す
        const allBadges = allBadgesRes.data;
        const myBadges = myBadgesRes.data;

        // expressionsはLaravelのページネーター形式
        const total = expressionsRes.data.total;

        // 突き合わせ
        const merged = allBadges.map((badge) => {
          // myBadgesの中に同じIDのバッジがあるかどうかを確認
          const myBadge = myBadges.find((b) => b.id === badge.id);
          return {
            ...badge,
            isUnlocked: !!myBadge,
            unlockedAt: myBadge ? myBadge.unlocked_at : null,
          };
        });

        // 登録数が少ない順にソート
        merged.sort((a, b) => a.condition - b.condition);

        setBadges(merged);
        setCurrentCount(total);
      } catch (error) {
        setError("バッジ情報の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>バッジ一覧</h1>
      <div className="badge-list">
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} currentCount={currentCount} />
        ))}
      </div>
    </div>
  );
};

export default BadgeListPage;
