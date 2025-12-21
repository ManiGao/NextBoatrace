// app/program/page.tsx
export const dynamic = "force-dynamic";

import ProgramView from "./ProgramView";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ProgramRow = {
  jyo: string;
  race_no: number;
  waku: number;
  player_name: string;
};

export default async function ProgramPage() {
  const { data, error } = await supabase
    .from("latest_programs_with_summary")
    .select("*")
    .order("race_no", { ascending: true })
    .order("waku", { ascending: true });

  if (error) {
    return (
      <main style={{ minHeight: "100vh", padding: "24px", color: "#e2e8f0" }}>
        <h1>今日の番組表</h1>
        <p>データ取得に失敗しました。</p>
        <pre>{error.message}</pre>
      </main>
    );
  }

  const rows = data as ProgramRow[];

  const grouped: Record<string, ProgramRow[]> = rows.reduce(
    (acc, row) => {
      if (!acc[row.jyo]) acc[row.jyo] = [];
      acc[row.jyo].push(row);
      return acc;
    },
    {} as Record<string, ProgramRow[]>
  );

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

        <ProgramView grouped={grouped} />
      </div>
    </main>
  );
}