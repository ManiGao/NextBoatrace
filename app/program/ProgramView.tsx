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

  const rows = grouped[selectedJyo] ?? [];

  return (
    <div>
      {/* ドロップダウン */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>場を選択：</label>
        <select
          value={selectedJyo}
          onChange={(e) => setSelectedJyo(e.target.value)}
          style={{ padding: "6px", fontSize: "14px" }}
        >
          {jyoList.map((jyo) => (
            <option key={jyo} value={jyo}>
              {jyo}
            </option>
          ))}
        </select>
      </div>

      {/* 選択した場のテーブル */}
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
          {rows.map((row, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #999" }}>{row.race_no}</td>
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
    </div>
  );
}