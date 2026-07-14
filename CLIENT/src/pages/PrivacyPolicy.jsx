import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export function PrivacyPolicy() {
  return (
    <main className="policy-page">
      <section style={{
        background: "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80')",
        height: "65vh", display: "flex", alignItems: "center", color: "white", textAlign: "center"
      }}>
        <div className="container" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          <h1 style={{ fontSize: "3.2rem", fontWeight: 800 }}>Privacy Policy</h1>
          <p style={{ fontSize: "1.3rem", opacity: 0.95 }}>Your Privacy, Our Responsibility</p>
        </div>
      </section>

      <section className="section" style={{ padding: "90px 20px" }}>
        <div className="container" style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ background: "#fff", padding: "60px", borderRadius: "20px", boxShadow: "0 15px 40px rgba(0,0,0,0.08)" }}>

            <h2 style={{ fontSize: "2.2rem", marginBottom: "1.8rem" }}>How We Protect Your Information</h2>
            
            <p style={{ fontSize: "1.1rem", lineHeight: 1.85 }}>
              NextGEN aapki privacy ko bahut seriously leta hai. Aap jo bhi personal information dete hain, 
              woh completely secure rahega.
            </p>

            <h3 style={{ margin: "35px 0 15px", fontSize: "1.65rem" }}>Information We Collect</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
              Name, Contact Details, Shipping Address, Payment Information aur Order History.
            </p>

            <h3 style={{ margin: "35px 0 15px", fontSize: "1.65rem" }}>How We Use Your Information</h3>
            <ul style={{ fontSize: "1.1rem", lineHeight: 2.0 }}>
              <li>Order processing aur delivery ke liye</li>
              <li>Customer support provide karne ke liye</li>
              <li>Website experience ko improve karne ke liye</li>
              <li>Promotional offers bhejane ke liye (agar aapne consent diya ho)</li>
            </ul>

            <h3 style={{ margin: "35px 0 15px", fontSize: "1.65rem" }}>Data Security</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
              Hum industry-standard encryption use karte hain. Aapka data kabhi bhi third parties ke saath sell ya share nahi kiya jaata.
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