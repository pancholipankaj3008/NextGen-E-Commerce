import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export function RefundPolicy() {
  return (
    <main>
      <section style={{
        background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&q=80')",
        height: "65vh", display: "flex", alignItems: "center", color: "white", textAlign: "center"
      }}>
        <div className="container" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          <h1 style={{ fontSize: "3.2rem", fontWeight: 800 }}>Refund & Return Policy</h1>
        </div>
      </section>

      <section className="section" style={{ padding: "90px 20px" }}>
        <div className="container" style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ background: "#fff", padding: "60px", borderRadius: "20px", boxShadow: "0 15px 40px rgba(0,0,0,0.08)" }}>

            <h2 style={{ fontSize: "2.2rem", marginBottom: "2rem" }}>Return & Refund Process</h2>

            <h3 style={{ fontSize: "1.65rem", margin: "35px 0 15px" }}>Return Window</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.85 }}>7 days from the date of delivery.</p>

            <h3 style={{ fontSize: "1.65rem", margin: "35px 0 15px" }}>Eligibility</h3>
            <ul style={{ fontSize: "1.1rem", lineHeight: 2.0 }}>
              <li>Product must be unused and in original condition with all tags attached.</li>
              <li>Packaging should be intact.</li>
              <li>Personalized or intimate apparel are non-returnable.</li>
            </ul>

            <h3 style={{ fontSize: "1.65rem", margin: "35px 0 15px" }}>Refund Timeline</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.85 }}>
              After we receive and inspect the returned product, refund will be processed within <strong>5-7 working days</strong> to the original payment method.
            </p>
          </div>

          <Link to="/" className="btn btn-primary" style={{ marginTop: "50px", padding: "15px 40px" }}>
            ← Back to Home
          </Link>
        </div>
      </section>
      <Footer/>
    </main>
  );
}