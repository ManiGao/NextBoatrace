// app/program/page.tsx
export const dynamic = "force-dynamic";

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

  // キャッシュ未準備などで { error: ... } が返ってきたときの保険
  if (!Array.isArray(data)) {
    return (
      <main style={{ padding: "20px" }}>
        <h1>今日の番組表</h1>
        <p>データ取得に失敗しました。</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </main>
    );
  }

  const rows = data as ProgramRow[];

  // 場ごとにグルーピング
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
      <h1 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "12px" }}>
        今日の番組表（場ごと）
      </h1>

      {Object.entries(grouped).map(([jyo, jyoRows]) => (
        <section key={jyo} style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "8px",
              borderLeft: "4px solid #333",
              paddingLeft: "8px",
            }}
          >
            {jyo}
          </h2>

          <table
            cellPadding={4}
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #999",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #999" }}>R</th>
                <th style={{ border: "1px solid #999" }}>枠</th>
                <th style={{ border: "1px solid #999" }}>選手名</th>
                <th style={{ border: "1px solid #999" }}>ST</th>
                <th style={{ border: "1px solid #999" }}>事故点</th>
                <th style={{ border: "1px solid #999" }}>事故率</th>
              </tr>
            </thead>
            <tbody>
              {jyoRows.map((row, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #999", whiteSpace: "nowrap" }}>
                    {row.race_no}
                  </td>
                  <td style={{ border: "1px solid #999", textAlign: "center" }}>
                    {row.waku}
                  </td>
                  <td style={{ border: "1px solid #999" }}>{row.player_name}</td>
                  <td style={{ border: "1px solid #999", textAlign: "right" }}>
                    {row.st}
                  </td>
                  <td style={{ border: "1px solid #999", textAlign: "right" }}>
                    {row.acc_point}
                  </td>
                  <td style={{ border: "1px solid #999", textAlign: "right" }}>
                    {row.acc_rate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </main>
  );
}