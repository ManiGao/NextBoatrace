"use client";

export default function Subscribe() {
  const handleCheckout = async () => {
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 12px",
        background:
          "radial-gradient(circle at top, #1d2a4d 0, #020617 55%, #000 100%)",
        color: "#e2e8f0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "rgba(15,23,42,0.95)",
          borderRadius: "24px",
          padding: "26px 22px 30px",
          boxShadow: "0 24px 70px rgba(15,23,42,0.95)",
          border: "1px solid rgba(148,163,184,0.3)",
        }}
      >
        <header
          style={{
            marginBottom: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.03em",
            }}
          >
            有料会員登録
          </h1>

          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              lineHeight: 1.6,
            }}
          >
            会員になることで、追加データの閲覧や今後提供予定の
            <span style={{ fontWeight: 500 }}>予想サポート機能</span>
            などが利用できるようになります。
          </p>
        </header>

        <section
          style={{
            marginBottom: "20px",
            padding: "12px 14px",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(30,64,175,0.85), rgba(8,47,73,0.9))",
            border: "1px solid rgba(148,163,184,0.4)",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            有料会員で利用できる主な機能
          </p>

          <ul
            style={{
              fontSize: "12px",
              color: "#e2e8f0",
              paddingLeft: "18px",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            <li>各選手の直近データをもとにした分析指標</li>
            <li>事故率・ST傾向の深掘りデータ</li>
            <li>予想精度向上のための特別コンテンツ（今後追加）</li>
          </ul>
        </section>

        <button
          type="button"
          onClick={handleCheckout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "12px 16px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background:
              "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "#f9fafb",
            fontSize: "15px",
            fontWeight: 600,
            boxShadow: "0 14px 35px rgba(37,99,235,0.55)",
          }}
        >
          決済ページへ進む
        </button>

        <p
          style={{
            marginTop: "12px",
            fontSize: "10px",
            color: "#64748b",
            lineHeight: 1.6,
          }}
        >
          ボタンを押すと、外部の安全な決済ページへ移動します。
          カード情報などは当サイトでは一切保持しません。
        </p>
      </div>
    </main>
  );
}