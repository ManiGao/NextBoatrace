"use client";

export default function Subscribe() {
  const handleCheckout = async () => {
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div>
      <h1>有料会員登録</h1>
      <button onClick={handleCheckout}>
        有料会員になる（Stripeへ）
      </button>
    </div>
  );
}