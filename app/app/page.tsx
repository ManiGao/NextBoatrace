import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default async function AppPage() {
  // Cookie から UID を取得
  const cookieStore = await cookies();
  const lineUid = cookieStore.get("line_uid")?.value;

  if (!lineUid) {
    // ログインしていない
    redirect("/login");
  }

  // Supabase（Service Role）で会員判定
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("line_uid", lineUid)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    redirect("/login");
  }

  if (!data?.is_member) {
    redirect("/subscribe");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">会員専用メニュー</h1>
          <p className="mt-1 text-sm text-gray-600">
            ログインおよび会員認証に成功しました 🎉
            <br />
            ここから各機能ページへ移動できます。
          </p>
        </header>

        <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            📊 今日の番組表＋事故点・事故率・ST平均
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            以前の GAS アプリで表示していた「当日の番組表＋事故点・事故率・ST 平均」の表を、
            今後は別ページとして表示します。
          </p>
          <p className="mt-1 text-xs text-gray-500">
            まずは「① 今日の番組表＋事故関連データ」ページ（例:{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px]">
              /program
            </code>
            ）を実装し、そこにデータを表示していきます。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">🔗 メニュー</h2>
          <div className="space-y-3">
            {/* ① 今日の番組表＋事故関連データ（利用可能） */}
            <Link
              href="/program"
              className="block rounded-lg border border-emerald-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    ① 今日の番組表＋事故関連データ
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    当日分の番組表、事故点・事故率、ST 平均などを一覧で確認するページです。
                    GAS / スプレッドシートから取得したデータを Next.js で表示します。
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  利用可能
                </span>
              </div>
            </Link>

            {/* ④ 将来解放するページ（グレーアウト・準備中） */}
            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 opacity-70">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-700">
                    ④ （将来の機能）
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    将来的に解放予定のページです。現時点では内容非公開のため、
                    メニュー上ではグレーアウト表示のみとしています。
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  準備中
                </span>
              </div>
            </div>

            {/* ⑤ 将来解放するページ（グレーアウト・準備中） */}
            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 opacity-70">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-700">
                    ⑤ （将来の機能）
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    こちらも将来的に公開予定のページです。
                    実装が完了した段階で、クリック可能なリンクに切り替えます。
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  準備中
                </span>
              </div>
            </div>

            {/* ⑦ 予想表（Note 連携イメージ） */}
            <Link
              href="/predict"
              className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    ⑦ 予想表（Note 連携イメージ）
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    Note に載せているような予想表を Web 版として整理する予定のページです。
                    まずはレイアウトやデータ構造から固めていきます。
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                  準備中
                </span>
              </div>
            </Link>

            {/* ⑥ ログアウト（まだ見た目だけ／準備中） */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-900">⑥ ログアウト</div>
                  <p className="mt-1 text-xs text-gray-600">
                    将来的に「line_uid クッキーを削除して /login に戻す」ログアウト機能をここから実行できるようにします。
                  </p>
                  <p className="mt-1 text-[11px] text-gray-500">
                    ※ まだ処理は実装していません。ログアウト API やアクションを用意したタイミングで、
                    ここにボタンやリンクを追加します。
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  準備中
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}