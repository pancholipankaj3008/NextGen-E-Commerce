export default function TopStrip() {
  return (
    <div style={{ width: "100%", overflow: "hidden", background: "#0a0a0a", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
      <div className="animate-marquee" style={{ whiteSpace: "nowrap", color: "#fff", padding: "18px 0", fontSize: 14, letterSpacing: "0.25em", fontWeight: 600, textTransform: "uppercase" }}>
        New Arrival / Premium Essentials / Free Shipping / Secure Checkout / New Arrival / Premium Essentials / Free Shipping / Secure Checkout
      </div>
    </div>
  );
}
