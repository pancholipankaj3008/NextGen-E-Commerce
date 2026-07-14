import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export function TermsConditions() {
  return (
    <main>
      <section style={{
        background: "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&q=80')",
        height: "65vh", display: "flex", alignItems: "center", color: "white", textAlign: "center"
      }}>
        <div className="container" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          <h1 style={{ fontSize: "3.2rem", fontWeight: 800 }}>Terms & Conditions</h1>
        </div>
      </section>

      <section className="section" style={{ padding: "90px 20px" }}>
        <div className="container" style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ background: "#fff", padding: "60px", borderRadius: "20px", boxShadow: "0 15px 40px rgba(0,0,0,0.08)" }}>

            <h2 style={{ fontSize: "2.2rem", marginBottom: "1.8rem" }}>General Terms</h2>
            
            <p style={{ fontSize: "1.1rem", lineHeight: 1.85 }}>
              By using NextGEN website and services, you agree to follow all the terms mentioned below.
            </p>

            <h3 style={{ fontSize: "1.65rem", margin: "35px 0 15px" }}>Pricing & Products</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
              We reserve the right to modify prices, products, and offers without prior notice.
            </p>

            <h3 style={{ fontSize: "1.65rem", margin: "35px 0 15px" }}>User Responsibilities</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
              You agree to provide accurate information and comply with all applicable laws while using our platform.
            </p>

            <h3 style={{ fontSize: "1.65rem", margin: "35px 0 15px" }}>Limitation of Liability</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
              NextGEN shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.
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