import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export function DeliveryPolicy() {
  return (
    <main className="policy-page">
      <section style={{
        background: "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1586528116311-4e7d7c5c3d7f?ixlib=rb-4.0.3&auto=format&fit=crop&q=80') center/cover",
        height: "65vh",
        display: "flex",
        alignItems: "center",
        color: "white",
        textAlign: "center"
      }}>
        <div className="container" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          <h1 style={{ fontSize: "3.2rem", fontWeight: 800, marginBottom: "0.8rem" }}>Delivery Policy</h1>
          <p style={{ fontSize: "1.3rem", opacity: 0.95 }}>Fast, Secure & Reliable Shipping</p>
        </div>
      </section>

      <section className="section" style={{ padding: "90px 20px", background: "#fafafa" }}>
        <div className="container" style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ background: "#fff", padding: "60px", borderRadius: "20px", boxShadow: "0 15px 40px rgba(0,0,0,0.08)" }}>

            <h2 style={{ fontSize: "2.2rem", marginBottom: "1.8rem" }}>Our Delivery Commitment</h2>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.85, color: "#444" }}>
              NextGEN ke har order ko hum India bhar mein tez, surakshit aur transparent tareeke se deliver karte hain. 
              Hum trusted logistics partners ke saath kaam karte hain taaki aapko best experience mile.
            </p>

            <h3 style={{ margin: "40px 0 15px", fontSize: "1.65rem" }}>Order Processing</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
              Saare orders working days mein <strong>24-48 hours</strong> ke andar process kar diye jaate hain. 
              Sunday aur public holidays par orders next working day process hote hain.
            </p>

            <h3 style={{ margin: "40px 0 15px", fontSize: "1.65rem" }}>Delivery Timeline</h3>
            <ul style={{ fontSize: "1.1rem", lineHeight: 2.0 }}>
              <li><strong>Metro Cities (Delhi, Mumbai, Bangalore etc.):</strong> 3–5 business days</li>
              <li><strong>Tier 2 Cities:</strong> 4–6 business days</li>
              <li><strong>Remote & Rural Areas:</strong> 6–9 business days</li>
            </ul>

            <h3 style={{ margin: "40px 0 15px", fontSize: "1.65rem" }}>Shipping Charges</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
              ₹1499 se upar ke orders par <strong>Free Shipping</strong>. Isse kam amount par ₹99 shipping charge lagega.
            </p>

            <h3 style={{ margin: "40px 0 15px", fontSize: "1.65rem" }}>Real-time Tracking</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
              Jaise hi order ship ho jaata hai, aapko email aur SMS ke through tracking link mil jaayega. 
              Aap apne account dashboard se bhi track kar sakte hain.
            </p>

            <p style={{ marginTop: "40px", fontSize: "1.05rem", color: "#d32f2f" }}>
              Note: Festive season, heavy rain ya kisi bhi unforeseen situation mein delivery time affect ho sakta hai.
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