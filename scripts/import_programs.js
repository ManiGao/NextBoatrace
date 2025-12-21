import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import csv from "csv-parser";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error(
        "環境変数 NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が未設定です"
    );
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ===== CSVファイル指定 =====
const CSV_PATH =
    "/Users/manimon/Development/Boatrace_datacode/accident_code/TVguide_players_2025-12-18.csv";

// ===== ファイル名から日付を取得 =====s
const dateMatch = CSV_PATH.match(/(\d{4}-\d{2}-\d{2})/);
if (!dateMatch) {
    throw new Error("ファイル名から日付を取得できません");
}
const programDate = dateMatch[1];

// ===== ヘルパー =====
const normalizeRaceNo = (raceStr) =>
    parseInt(
        raceStr
            .replace(/[０-９]/g, (c) =>
                String.fromCharCode(c.charCodeAt(0) - 0xfee0)
            )
            .replace("R", ""),
        10
    );

// ===== メイン処理 =====
async function run() {
    const rows = [];
    const wakuCounter = {}; // key: date|jyo|race_no

    fs.createReadStream(CSV_PATH)
        .pipe(csv())
        .on("data", (row) => {
            const jyo = row["場名"] ?? row["﻿場名"];
            const race_no = normalizeRaceNo(row["レース"]);
            const key = `${programDate}|${jyo}|${race_no}`;

            if (!jyo || !race_no) {
                console.warn("必須項目欠損のためスキップ:", row);
                return;
            }

            wakuCounter[key] = (wakuCounter[key] || 0) + 1;

            rows.push({
                date: programDate,
                jyo,
                race_no,
                waku: wakuCounter[key],
                player_name: row["選手名"],
            });
        })
        .on("end", async () => {
            console.log(`CSV読み込み完了: ${rows.length}行`);

            const { error } = await supabase
                .from("programs")
                .upsert(rows, {
                    onConflict: "date,jyo,race_no,waku",
                });

            if (error) {
                console.error("❌ Supabase upsert エラー", error);
            } else {
                console.log("✅ programs テーブルにインポート完了");
            }
        });
}

run();