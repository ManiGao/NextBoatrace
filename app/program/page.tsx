// app/program/page.tsx
export const dynamic = "force-dynamic";

import ProgramView from "./ProgramView";

type ProgramRow = {
  jyo: string;
  race_no: string;
  waku: number;
  player_name: string;
  st: number;
  acc_point: number;
  acc_rate: number;
};

export default async function ProgramPage() {
  const apiUrl = process.env.NEXT_PUBLIC_GAS_PROGRAM_API_URL!;
  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();

  if (!Array.isArray(data)) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "24px 12px",
          background:
            "radial-gradient(circle at top, #1d2a4d 0, #020617 55%, #000 100%)",
          color: "#e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            width: "100%",
            padding: "24px",
            borderRadius: "18px",
            background: "rgba(15,23,42,0.95)",
            boxShadow: "0 20px 60px rgba(15,23,42,0.9)",
          }}
        >
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            今日の番組表
          </h1>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            データ取得に失敗しました。
          </p>
          <pre
            style={{
              marginTop: "12px",
              fontSize: "11px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              color: "#64748b",
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
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