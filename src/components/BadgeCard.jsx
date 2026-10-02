function BadgeCard({ badge, currentCount }) {
  const { name, description, condition, isUnlocked, unlockedAt } = badge;

  // 未獲得の場合、後何個で獲得できるかを計算
  const remaining = Math.max(condition - currentCount, 0);

  // 日付を「YYYY-MM-DD」形式でフォーマット
  const formattedUnlockedAt = unlockedAt ? unlockedAt.slice(0, 10) : null;

  return (
    // 獲得済み/未獲得でクラス名を切り替え、CSS側でグレーアウトなどを制御する想定
    <div className={isUnlocked ? "badge-card unlocked" : "badge-card locked"}>
      <h3>
        {name} {isUnlocked && "✅"}
      </h3>
      <p>{description}</p>

      {isUnlocked ? (
        <p>{formattedUnlockedAt}に獲得</p>
      ) : (
        <p>あと{remaining}個で解放</p>
      )}
    </div>
  );
}

export default BadgeCard;
