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
      <main style={{ padding: "20px" }}>
        <h1>今日の番組表</h1>
        <p>データ取得に失敗しました。</p>
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
    <main style={{ padding: "20px" }}>
      <h1 style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "20px" }}>
        今日の番組表（ドロップダウン式）
      </h1>

      <ProgramView grouped={grouped} />
    </main>
  );
}