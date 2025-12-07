// app/program/page.tsx
export const dynamic = "force-dynamic";

export default async function ProgramPage() {
  const apiUrl = process.env.NEXT_PUBLIC_GAS_PROGRAM_API_URL!;
  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();

  return (
    <main style={{ padding: "20px" }}>
      <h1>今日の番組表</h1>

      <table
        cellPadding={6}
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
          border: "1px solid black",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid black" }}>場</th>
            <th style={{ border: "1px solid black" }}>R</th>
            <th style={{ border: "1px solid black" }}>枠</th>
            <th style={{ border: "1px solid black" }}>選手名</th>
            <th style={{ border: "1px solid black" }}>ST</th>
            <th style={{ border: "1px solid black" }}>事故点</th>
            <th style={{ border: "1px solid black" }}>事故率</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row: any, index: number) => (
            <tr key={index}>
              <td style={{ border: "1px solid black" }}>{row.jyo}</td>
              <td style={{ border: "1px solid black" }}>{row.race_no}</td>
              <td style={{ border: "1px solid black" }}>{row.waku}</td>
              <td style={{ border: "1px solid black" }}>{row.player_name}</td>
              <td style={{ border: "1px solid black" }}>{row.st}</td>
              <td style={{ border: "1px solid black" }}>{row.acc_point}</td>
              <td style={{ border: "1px solid black" }}>{row.acc_rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}