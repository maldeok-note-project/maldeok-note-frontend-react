// 確認用のポップアップ（画面の中に自作する、共通部品）
// window.confirm は、環境によって動かないことがあるため使用しない
const ConfirmModal = ({ show, message, onConfirm, onCancel }) => {
  // show が false の時は、何も表示しない
  if (!show) {
    return null;
  }

  return (
    <div
      className="confirm-modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="confirm-modal-box"
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "320px",
          width: "90%",
          textAlign: "center",
        }}
      >
        <p style={{ marginBottom: "20px" }}>{message}</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button className="btn btn-secondary" onClick={onCancel}>
            キャンセル
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            削除する
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
