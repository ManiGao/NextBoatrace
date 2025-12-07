"use client";

export default function LoginPage() {
  const handleLineLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID!;
    const redirect = process.env.NEXT_PUBLIC_LINE_CALLBACK_URL!;
    const state = Math.random().toString(36).substring(2);

    const loginUrl =
      "https://access.line.me/oauth2/v2.1/authorize" +
      "?response_type=code" +
      "&client_id=" +
      clientId +
      "&redirect_uri=" +
      encodeURIComponent(redirect) +
      "&state=" +
      state +
      "&scope=openid%20profile";

    window.location.href = loginUrl;
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
          maxWidth: "420px",
          background: "rgba(15,23,42,0.95)",
          borderRadius: "24px",
          padding: "24px 20px 26px",
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
            ログイン
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              lineHeight: 1.5,
            }}
          >
            会員専用ページにアクセスするには、
            <span style={{ fontWeight: 500 }}>LINEでログイン</span>
            してください。
          </p>
        </header>

        <section
          style={{
            marginBottom: "18px",
            padding: "10px 12px",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg, rgba(30,64,175,0.85), rgba(8,47,73,0.9))",
            border: "1px solid rgba(148,163,184,0.4)",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            このページでできること
          </div>
          <ul
            style={{
              fontSize: "11px",
              color: "#e2e8f0",
              paddingLeft: "16px",
              margin: 0,
            }}
          >
            <li>本日の番組表と選手情報の確認</li>
            <li>事故点・事故率・STデータの閲覧</li>
            <li>将来的な予想コンテンツへのアクセス</li>
          </ul>
        </section>

        <button
          type="button"
          onClick={handleLineLogin}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 14px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background:
              "linear-gradient(135deg, #10b981, #16a34a)",
            color: "#f9fafb",
            fontSize: "14px",
            fontWeight: 600,
            boxShadow: "0 14px 35px rgba(22,163,74,0.65)",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "22px",
              height: "22px",
              borderRadius: "6px",
              backgroundColor: "#f9fafb",
              color: "#16a34a",
              fontSize: "14px",
              fontWeight: 800,
            }}
          >
            L
          </span>
          LINEでログイン
        </button>

        <p
          style={{
            marginTop: "10px",
            fontSize: "10px",
            color: "#64748b",
            lineHeight: 1.6,
          }}
        >
          ボタンを押すことで、LINEアカウントと連携した会員認証を行います。
          メールアドレスなどの不要な情報は取得しません。
        </p>
      </div>
    </main>
  );
}