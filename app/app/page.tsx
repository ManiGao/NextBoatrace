import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default async function AppPage() {
  // Cookie から UID を取得
  const cookieStore = await cookies();
  const lineUid = cookieStore.get("line_uid")?.value;

  if (!lineUid) {
    // ログインしていない
    redirect("/login");
  }

  // Supabase（Service Role）で会員判定
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("line_uid", lineUid)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    redirect("/login");
  }

  if (!data?.is_member) {
    redirect("/subscribe");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 12px 40px",
        background:
          "radial-gradient(circle at top, #1d2a4d 0, #020617 55%, #000 100%)",
        color: "#e2e8f0",
        display: "flex",
        justifyContent: "center",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          background: "rgba(15,23,42,0.9)",
          borderRadius: "24px",
          padding: "24px 22px 30px",
          boxShadow: "0 24px 70px rgba(15,23,42,0.95)",
          border: "1px solid rgba(148,163,184,0.3)",
        }}
      >
        <header style={{ marginBottom: "22px" }}>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "0.03em",
              marginBottom: "6px",
            }}
          >
            会員専用メニュー
          </h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.6 }}>
            ログインおよび会員認証に成功しました 🎉  
            各機能ページへアクセスできます。
          </p>
        </header>

        {/* Section: 番組表モジュール */}
        <section
          style={{
            marginBottom: "20px",
            padding: "14px 16px",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(30,64,175,0.85), rgba(8,47,73,0.9))",
            border: "1px solid rgba(148,163,184,0.4)",
          }}
        >
          <h2 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>
            📊 今日の番組表 + 事故点 / 事故率 / ST
          </h2>
          <p style={{ fontSize: "12px", color: "#e2e8f0", lineHeight: 1.5 }}>
            GAS スプレッドシートと連携し、選手データと番組表をまとめて確認できるページです。
          </p>
          <p style={{ fontSize: "11px", marginTop: "6px", color: "#cbd5e1" }}>
            実装済み：  
            <code
              style={{
                padding: "2px 4px",
                borderRadius: "4px",
                background: "rgba(15,23,42,0.6)",
                fontSize: "11px",
              }}
            >
              /program
            </code>
          </p>
        </section>

        {/* Section: メニューリンク */}
        <section>
          <h2
            style={{
              marginBottom: "12px",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            🔗 メニュー
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* ① Program */}
            <Link
              href="/program"
              style={{
                display: "block",
                padding: "16px",
                borderRadius: "16px",
                background: "rgba(15,23,42,0.6)",
                border: "1px solid rgba(56,189,248,0.35)",
                boxShadow: "0 10px 30px rgba(15,23,42,0.7)",
                transition: "0.2s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600 }}>
                    ① 今日の番組表＋事故関連データ
                  </div>
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "12px",
                      color: "#94a3b8",
                      lineHeight: 1.5,
                    }}
                  >
                    当日番組表・ST・事故点などをまとめて閲覧するページ
                  </p>
                </div>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "999px",
                    background: "rgba(56,189,248,0.15)",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#38bdf8",
                    height: "fit-content",
                  }}
                >
                  利用可能
                </span>
              </div>
            </Link>

            {/* ④ future */}
            <div
              style={{
                padding: "16px",
                borderRadius: "16px",
                background: "rgba(30,41,59,0.4)",
                border: "1px dashed rgba(148,163,184,0.4)",
                opacity: 0.6,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600 }}>
                    ④（将来の機能）
                  </div>
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "12px",
                      color: "#94a3b8",
                      lineHeight: 1.5,
                    }}
                  >
                    将来的に解放予定のページ
                  </p>
                </div>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "999px",
                    background: "rgba(148,163,184,0.2)",
                    fontSize: "10px",
                    color: "#94a3b8",
                    height: "fit-content",
                  }}
                >
                  準備中
                </span>
              </div>
            </div>

            {/* ⑤ future */}
            <div
              style={{
                padding: "16px",
                borderRadius: "16px",
                background: "rgba(30,41,59,0.4)",
                border: "1px dashed rgba(148,163,184,0.4)",
                opacity: 0.6,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600 }}>
                    ⑤（将来の機能）
                  </div>
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "12px",
                      color: "#94a3b8",
                      lineHeight: 1.5,
                    }}
                  >
                    実装完了後にクリック可能になります
                  </p>
                </div>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "999px",
                    background: "rgba(148,163,184,0.2)",
                    fontSize: "10px",
                    color: "#94a3b8",
                    height: "fit-content",
                  }}
                >
                  準備中
                </span>
              </div>
            </div>

            {/* ⑦ predict */}
            <Link
              href="/predict"
              style={{
                padding: "16px",
                borderRadius: "16px",
                background: "rgba(15,23,42,0.6)",
                border: "1px solid rgba(251,191,36,0.35)",
                boxShadow: "0 10px 30px rgba(15,23,42,0.7)",
                display: "block",
                transition: "0.2s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600 }}>
                    ⑦ 予想表（Note 連携イメージ）
                  </div>
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "12px",
                      color: "#94a3b8",
                      lineHeight: 1.5,
                    }}
                  >
                    予想表を Web 版で整備していく予定のページ
                  </p>
                </div>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "999px",
                    background: "rgba(251,191,36,0.15)",
                    fontSize: "10px",
                    color: "#fbbf24",
                    height: "fit-content",
                  }}
                >
                  準備中
                </span>
              </div>
            </Link>

            {/* logout placeholder */}
            <div
              style={{
                padding: "16px",
                borderRadius: "16px",
                background: "rgba(15,23,42,0.6)",
                border: "1px solid rgba(148,163,184,0.3)",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: 600 }}>
                ⑥ ログアウト（準備中）
              </div>
              <p
                style={{
                  marginTop: "6px",
                  fontSize: "12px",
                  color: "#94a3b8",
                  lineHeight: 1.5,
                }}
              >
                将来的に line_uid クッキーを削除して /login に遷移させるログアウト機能をここに実装します。
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}