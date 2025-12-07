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

function formatNumber(value: number | null | undefined, digits: number) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return value.toFixed(digits);
}

export default function ProgramView({ grouped }: { grouped: Record<string, ProgramRow[]> }) {
  const jyoList = Object.keys(grouped);
  const [selectedJyo, setSelectedJyo] = useState(jyoList[0] ?? "");
  const [openRace, setOpenRace] = useState<string | null>(null);

  const allRows = grouped[selectedJyo] ?? [];

  // Rごとにまとめる
  const races = allRows.reduce((acc: Record<string, ProgramRow[]>, row) => {
    if (!acc[row.race_no]) acc[row.race_no] = [];
    acc[row.race_no].push(row);
    return acc;
  }, {});

  const sortedRaceNos = Object.keys(races).sort((a, b) => {
    const numA = parseInt(a.replace(/[^0-9]/g, ""));
    const numB = parseInt(b.replace(/[^0-9]/g, ""));
    return numA - numB;
  });

  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ドロップダウン行 */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: "14px", color: "#64748b" }}>
          場を選択して番組表を表示
        </div>

        <div
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <select
            value={selectedJyo}
            onChange={(e) => {
              setSelectedJyo(e.target.value);
              setOpenRace(null);
            }}
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              padding: "8px 36px 8px 12px",
              borderRadius: "999px",
              border: "1px solid #cbd5f5",
              backgroundColor: "#0f172a",
              color: "#e2e8f0",
              fontSize: "14px",
              outline: "none",
              boxShadow: "0 8px 24px rgba(15,23,42,0.45)",
              cursor: "pointer",
            }}
          >
            {jyoList.map((jyo) => (
              <option key={jyo} value={jyo}>
                {jyo}
              </option>
            ))}
          </select>
          {/* ▼アイコン */}
          <span
            style={{
              position: "absolute",
              right: "12px",
              pointerEvents: "none",
              fontSize: "10px",
              color: "#94a3b8",
            }}
          >
            ▼
          </span>
        </div>
      </div>

      {/* 選択中の場タイトル */}
      <h2
        style={{
          fontSize: "18px",
          fontWeight: 600,
          marginBottom: "12px",
          color: "#e2e8f0",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "6px",
            height: "24px",
            borderRadius: "999px",
            background:
              "linear-gradient(180deg, rgba(96,165,250,1), rgba(56,189,248,1))",
          }}
        />
        {selectedJyo}
        <span
          style={{
            fontSize: "11px",
            fontWeight: 400,
            color: "#64748b",
            marginLeft: "4px",
          }}
        >
          （1R〜12R）
        </span>
      </h2>

      {/* レースごとのアコーディオン */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {sortedRaceNos.map((race_no) => {
          const rows = races[race_no];
          const isOpen = openRace === race_no;

          return (
            <div
              key={race_no}
              style={{
                borderRadius: "14px",
                border: "1px solid rgba(148,163,184,0.35)",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.75))",
                boxShadow: isOpen
                  ? "0 16px 45px rgba(15,23,42,0.9)"
                  : "0 10px 30px rgba(15,23,42,0.7)",
                overflow: "hidden",
                transition: "box-shadow 0.18s ease-out, border-color 0.18s",
              }}
            >
              {/* ヘッダー（クリックで開閉） */}
              <button
                type="button"
                onClick={() => setOpenRace(isOpen ? null : race_no)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  background: "transparent",
                  border: "none",
                  color: "#e2e8f0",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "28px",
                      height: "28px",
                      borderRadius: "999px",
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(248,250,252,0.9), rgba(59,130,246,0.18))",
                      color: "#0f172a",
                      fontWeight: 700,
                      fontSize: "13px",
                    }}
                  >
                    {race_no.replace(/[^0-9]/g, "")}R
                  </span>
                  <span style={{ fontWeight: 500 }}>{race_no}</span>
                </div>

                <span
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                  }}
                >
                  {isOpen ? "閉じる ▲" : "詳細を見る ▼"}
                </span>
              </button>

              {/* 展開部 */}
              {isOpen && (
                <div style={{ borderTop: "1px solid rgba(51,65,85,0.9)" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table
                      cellPadding={6}
                      style={{
                        width: "620px",
                        minWidth: "620px",
                        borderCollapse: "collapse",
                        fontSize: "12px",
                        color: "#e2e8f0",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(30,64,175,0.85), rgba(8,47,73,0.9))",
                          }}
                        >
                          <th
                            style={{
                              textAlign: "center",
                              borderBottom: "1px solid rgba(15,23,42,0.9)",
                            }}
                          >
                            枠
                          </th>
                          <th
                            style={{
                              textAlign: "left",
                              borderBottom: "1px solid rgba(15,23,42,0.9)",
                            }}
                          >
                            選手名
                          </th>
                          <th
                            style={{
                              textAlign: "right",
                              borderBottom: "1px solid rgba(15,23,42,0.9)",
                            }}
                          >
                            ST
                          </th>
                          <th
                            style={{
                              textAlign: "right",
                              borderBottom: "1px solid rgba(15,23,42,0.9)",
                            }}
                          >
                            事故点
                          </th>
                          <th
                            style={{
                              textAlign: "right",
                              borderBottom: "1px solid rgba(15,23,42,0.9)",
                            }}
                          >
                            事故率
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, index) => (
                          <tr
                            key={index}
                            style={{
                              background:
                                index % 2 === 0
                                  ? "rgba(15,23,42,0.0)"
                                  : "rgba(15,23,42,0.5)",
                            }}
                          >
                            <td
                              style={{
                                textAlign: "center",
                                borderBottom: "1px solid rgba(30,41,59,0.9)",
                                fontWeight: 600,
                              }}
                            >
                              {row.waku}
                            </td>
                            <td
                              style={{
                                borderBottom: "1px solid rgba(30,41,59,0.9)",
                              }}
                            >
                              {row.player_name}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                borderBottom: "1px solid rgba(30,41,59,0.9)",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            >
                              {formatNumber(row.st, 3)}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                borderBottom: "1px solid rgba(30,41,59,0.9)",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            >
                              {row.acc_point ?? "-"}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                borderBottom: "1px solid rgba(30,41,59,0.9)",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            >
                              {formatNumber(row.acc_rate, 3)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}