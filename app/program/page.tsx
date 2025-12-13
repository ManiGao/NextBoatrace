// app/program/page.tsx
export const dynamic = "force-dynamic";

import ProgramView from "./ProgramView";
import { createClient } from "@supabase/supabase-js";

type PlayerSummaryRow = {
  player_id: number;
  player_name: string;
  total_starts: number;
  accident_count: number;
  accident_rate: number;
  st_count: number | null;
  avg_st: number | null;
};

export default async function ProgramPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .from("player_summary")
    .select("*")
    .order("accident_rate", { ascending: false });

  if (error || !Array.isArray(data)) {
    return (
      <main style={{ minHeight: "100vh", padding: "24px", color: "#e2e8f0" }}>
        <h1>データ取得エラー</h1>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(error ?? data, null, 2)}
        </pre>
      </main>
    );
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
          padding: "20px 18px 22px",
          boxShadow: "0 24px 70px rgba(15,23,42,0.95)",
          border: "1px solid rgba(148,163,184,0.3)",
        }}
      >
        <header
          style={{
            marginBottom: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.03em",
            }}
          >
            今日の番組表
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: "#94a3b8",
            }}
          >
            場・レースを切り替えながら、選手の事故率やSTを素早く確認できます。
          </p>
        </header>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px" }}>選手名</th>
              <th style={{ textAlign: "right", padding: "8px" }}>出走数</th>
              <th style={{ textAlign: "right", padding: "8px" }}>事故数</th>
              <th style={{ textAlign: "right", padding: "8px" }}>事故率</th>
              <th style={{ textAlign: "right", padding: "8px" }}>ST平均</th>
            </tr>
          </thead>
          <tbody>
            {(data as PlayerSummaryRow[]).map((r) => (
              <tr key={r.player_id} style={{ borderTop: "1px solid rgba(148,163,184,0.2)" }}>
                <td style={{ padding: "8px" }}>{r.player_name}</td>
                <td style={{ padding: "8px", textAlign: "right" }}>{r.total_starts}</td>
                <td style={{ padding: "8px", textAlign: "right" }}>{r.accident_count}</td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  {(r.accident_rate * 100).toFixed(2)}%
                </td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  {r.avg_st !== null ? r.avg_st.toFixed(4) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}