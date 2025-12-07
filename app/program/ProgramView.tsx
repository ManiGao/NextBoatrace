"use client";

import { useState } from "react";

type ProgramRow = {
  jyo: string;
  race_no: string;
  waku: number;
  player_name: string;
  st: number;
  acc_point: number;
  acc_rate: number;
};

export default function ProgramView({ grouped }: { grouped: Record<string, ProgramRow[]> }) {
  const jyoList = Object.keys(grouped);
  const [selectedJyo, setSelectedJyo] = useState(jyoList[0] ?? "");

  const allRows = grouped[selectedJyo] ?? [];

  // ----- 1R〜12Rの配列へ変換 -----
  const races = allRows.reduce((acc: Record<string, ProgramRow[]>, row) => {
    if (!acc[row.race_no]) acc[row.race_no] = [];
    acc[row.race_no].push(row);
    return acc;
  }, {});

  const sortedRaceNos = Object.keys(races).sort((a, b) => {
    // 「1R」「２Ｒ」など全角が混じる可能性があるため数字抽出
    const numA = parseInt(a.replace(/[^0-9]/g, ""));
    const numB = parseInt(b.replace(/[^0-9]/g, ""));
    return numA - numB;
  });

  // ----- アコーディオン（開いているレース番号） -----
  const [openRace, setOpenRace] = useState<string | null>(null);

  return (
    <div>
      {/* ▼ 場のドロップダウン */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>場を選択：</label>
        <select
          value={selectedJyo}
          onChange={(e) => {
            setSelectedJyo(e.target.value);
            setOpenRace(null); // 場を変えたらアコーディオンを初期化
          }}
          style={{ padding: "6px", fontSize: "14px" }}
        >
          {jyoList.map((jyo) => (
            <option key={jyo} value={jyo}>
              {jyo}
            </option>
          ))}
        </select>
      </div>

      <h2
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          marginBottom: "8px",
          borderLeft: "4px solid #333",
          paddingLeft: "8px",
        }}
      >
        {selectedJyo}
      </h2>

      {/* ▼ アコーディオン形式のレース一覧 */}
      {sortedRaceNos.map((race_no) => {
        const rows = races[race_no];

        const isOpen = openRace === race_no;

        return (
          <div
            key={race_no}
            style={{
              border: "1px solid #bbb",
              marginBottom: "10px",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            {/* ▼ レースタイトル行（クリックで開閉） */}
            <div
              style={{
                padding: "10px",
                background: "#eee",
                cursor: "pointer",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onClick={() => setOpenRace(isOpen ? null : race_no)}
            >
              <span>{race_no}</span>
              <span>{isOpen ? "▲" : "▼"}</span>
            </div>

            {/* ▼ 展開部分 */}
            {isOpen && (
              <table
                cellPadding={4}
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #999" }}>枠</th>
                    <th style={{ border: "1px solid #999" }}>選手名</th>
                    <th style={{ border: "1px solid #999" }}>ST</th>
                    <th style={{ border: "1px solid #999" }}>事故点</th>
                    <th style={{ border: "1px solid #999" }}>事故率</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
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
            )}
          </div>
        );
      })}
    </div>
  );
}