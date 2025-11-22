"use client";

export default function LoginPage() {
  const handleLineLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID!;
    const redirect = process.env.NEXT_PUBLIC_LINE_CALLBACK_URL!;
    const state = Math.random().toString(36).substring(2);

    const loginUrl =
      "https://access.line.me/oauth2/v2.1/authorize" +
      "?response_type=code" +
      "&client_id=" + clientId +
      "&redirect_uri=" + encodeURIComponent(redirect) +
      "&state=" + state +
      "&scope=openid%20profile";

    window.location.href = loginUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">LINEでログイン</h1>
      <button
        onClick={handleLineLogin}
        className="px-6 py-3 bg-green-500 text-white rounded-lg shadow"
      >
        LINEでログイン
      </button>
    </div>
  );
}