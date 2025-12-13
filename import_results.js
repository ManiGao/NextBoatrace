// import_results.js

const fs = require("fs");
const csv = require("csv-parser");
const { createClient } = require("@supabase/supabase-js");

// 環境変数から Supabase 情報を読む
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("環境変数 SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください。");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/*
CSV列構造：
場名, 日付, レース, 着順, 艇番, 登番, 選手名, モーター, ボート,
展示タイム, 進入, ST, レースタイム, 決まり手, ミッドナイト
*/

function parseFloatOrNull(v) {
  if (!v || v === "." || v === "NaN") return null;
  const n = parseFloat(v);
  return Number.isNaN(n) ? null : n;
}

function parseIntOrNull(v) {
  if (!v || v === "." || v === "NaN") return null;
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
}

async function getOrCreateRace(date, jyo, race_no, kimarite, is_midnight) {
  const { data: existing, error: selErr } = await supabase
    .from("races")
    .select("id")
    .eq("date", date)
    .eq("jyo", jyo)
    .eq("race_no", race_no)
    .maybeSingle();

  if (selErr) {
    console.error("SELECT races エラー:", selErr);
    throw selErr;
  }

  if (existing) return existing.id;

  const { data: inserted, error: insErr } = await supabase
    .from("races")
    .insert([
      {
        date,
        jyo,
        race_no,
        kimarite,
        is_midnight,
      },
    ])
    .select("id")
    .single();

  if (insErr) {
    console.error("INSERT races エラー:", insErr);
    throw insErr;
  }

  return inserted.id;
}

async function insertRaceResult(r) {
  const { error } = await supabase.from("race_results").insert([r]);
  if (error) {
    console.error("INSERT race_results エラー:", error);
    throw error;
  }
}

async function run() {
  const filePath = "./result_player_all.csv";
  console.log("CSV 読み込み開始:", filePath);

  const rows = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const normalized = {};
      for (const [key, value] of Object.entries(row)) {
        const cleanKey = key.replace(/^\uFEFF/, "");
        normalized[cleanKey] = value;
      }
      rows.push(normalized);
    })
    .on("end", async () => {
      console.log("CSV 読み込み完了 行数:", rows.length);

      for (const row of rows) {
        try {
          const jyo = row["場名"]?.trim() || null;
          const rawDate = row["日付"]?.trim();
          const date = rawDate ? rawDate.replace(/\//g, "-") : null;
          const race_no = parseInt(row["レース"], 10);

          // 必須項目チェック（場名・日付・レース番号が無い行はスキップ）
          if (!jyo || !date || Number.isNaN(race_no)) {
            console.warn("必須項目欠損のためスキップ:", {
              jyo: row["場名"],
              date: row["日付"],
              race_no: row["レース"],
            });
            continue;
          }

          const lane = parseInt(row["艇番"], 10);
          const player_id = parseInt(row["登番"], 10);
          const player_name = row["選手名"];

          const motor_no = parseIntOrNull(row["モーター"]);
          const boat_no = parseIntOrNull(row["ボート"]);

          const exhibit_time = parseFloatOrNull(row["展示タイム"]);
          const shinnyu = parseIntOrNull(row["進入"]);
          const st_raw = row["ST"]?.trim() || null;
          const st_value =
            st_raw && /^[0-9.]+$/.test(st_raw) ? parseFloat(st_raw) : null;

          const kimarite = row["決まり手"];

          // ミッドナイト判定：CSV上で "M" が入っている場合のみ true
          const midnight_raw = row["ミッドナイト"];
          const is_midnight = midnight_raw === "M";

          // 着順・レースタイム（元CSVから取得）
          const kakutei_chaku = row["着順"];
          const race_time_raw = row["レースタイム"];

          // races から race_id を取得 or 新規作成
          const race_id = await getOrCreateRace(
            date,
            jyo,
            race_no,
            kimarite,
            is_midnight
          );

          await insertRaceResult({
            race_id,
            lane,
            player_id,
            player_name,
            motor_no,
            boat_no,
            exhibit_time,
            shinnyu,
            st_raw,
            st_value,
            kakutei_chaku,
            race_time_raw,
          });

          console.log(`INSERT OK: ${date} ${jyo} ${race_no}R lane ${lane}`);
        } catch (err) {
          console.error("1行の処理中にエラー:", err);
        }
      }

      console.log("全データのインポート完了！");
      console.log("CSVヘッダー:", Object.keys(rows[0]));
    });
}

run();