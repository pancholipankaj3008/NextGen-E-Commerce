import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { Award, Leaf, Sparkles, Users } from "lucide-react";

export function About() {
  return (
    <main className="about-page">
      {/* Hero Section */}
      <section 
        className="hero-section"
        style={{
          background: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url('https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&q=80') center/cover no-repeat",
          height: "85vh",
          display: "flex",
          alignItems: "center",
          color: "white",
          position: "relative"
        }}
      >
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
          <h1 
            className="title" 
            style={{ 
              fontSize: "4.5rem", 
              fontWeight: 800, 
              letterSpacing: "-2px",
              marginBottom: "1rem",
              textShadow: "0 4px 20px rgba(0,0,0,0.6)"
            }}
          >
            About NextGEN
          </h1>
          <p 
            className="subtitle" 
            style={{ 
              fontSize: "1.5rem", 
              maxWidth: "700px", 
              margin: "0 auto 2rem",
              opacity: 0.95,
              lineHeight: 1.6
            }}
          >
            Where timeless elegance meets tomorrow's fashion
          </p>
          <Link
            to="/"
            className="btn btn-primary"
            style={{
              padding: "16px 48px",
              fontSize: "1.1rem",
              background: "#fff",
              color: "#000",
              border: "none",
              borderRadius: "50px",
              fontWeight: 600,
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => e.target.style.transform = "translateY(-3px)"}
            onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
          >
            Explore Our World →
          </Link>
        </div>
      </section>

      {/* Story Section */}
      <section className="section" style={{ padding: "100px 20px", background: "#fafafa" }}>
        <div className="container" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "2.8rem", marginBottom: "1.5rem", lineHeight: 1.2 }}>
                Our Story
              </h2>
              <p style={{ fontSize: "1.15rem", lineHeight: 1.85, color: "#444" }}>
                Founded in 2022, NextGEN was born from a simple idea: fashion should be <strong>premium yet accessible</strong>, 
                timeless yet forward-thinking. We believe clothing is more than fabric — it's an expression of confidence, 
                personality, and values.
              </p>
              <p style={{ fontSize: "1.15rem", lineHeight: 1.85, color: "#444", marginTop: "1.5rem" }}>
                From carefully selected premium fabrics to ethical manufacturing partners, every piece in our collection 
                tells a story of craftsmanship, innovation, and respect for both people and planet.
              </p>
            </div>
            
            <div style={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}>
              <img 
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&q=80" 
                alt="NextGEN Studio"
                style={{ width: "100%", display: "block" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section" style={{ padding: "90px 20px" }}>
        <div className="container" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "2.3rem" }}>What Drives Us</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "15px" }}>
            {[
              { 
                icon: <Award size={48} strokeWidth={1.8} />, 
                title: "Premium Quality", 
                desc: "Handpicked fabrics and expert craftsmanship in every garment." 
              },
              { 
                icon: <Leaf size={48} strokeWidth={1.8} />, 
                title: "Ethical Fashion", 
                desc: "Fair trade practices and sustainable sourcing." 
              },
              { 
                icon: <Sparkles size={48} strokeWidth={1.8} />, 
                title: "Modern Design", 
                desc: "Clean, contemporary styles with innovative details." 
              },
              { 
                icon: <Users size={48} strokeWidth={1.8} />, 
                title: "Customer First", 
                desc: "Exceptional service and hassle-free shopping experience." 
              }
            ].map((item, i) => (
              <div key={i} style={{
                background: "#fff",
                padding: "40px 30px",
                borderRadius: "18px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
                textAlign: "center",
                transition: "transform 0.3s ease"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-8px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ color: "#e91e63", marginBottom: "20px" }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "12px" }}>{item.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
         

      {/* Mission & Vision */}
      <section className="section" style={{ padding: "100px 20px", background: "#0a0a0a", color: "#fff" }}>
        <div className="container" style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "2.6rem", marginBottom: "2rem" }}>Our Promise</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "60px", marginTop: "60px" }}>
            <div>
              <h3 style={{ fontSize: "1.8rem", marginBottom: "1.2rem", color: "#ddd" }}>Mission</h3>
              <p style={{ fontSize: "1.2rem", lineHeight: 1.8, opacity: 0.9 }}>
                To redefine premium fashion by making exceptional design and quality accessible to the modern individual who values both style and substance.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: "1.8rem", marginBottom: "1.2rem", color: "#ddd" }}>Vision</h3>
              <p style={{ fontSize: "1.2rem", lineHeight: 1.8, opacity: 0.9 }}>
                A world where fashion empowers confidence, celebrates individuality, and respects our planet for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "120px 20px", background: "linear-gradient(135deg, #1a1a1a, #000)", color: "white", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>
            Ready to join the NextGEN family?
          </h2>
          <p style={{ fontSize: "1.3rem", opacity: 0.9, marginBottom: "40px" }}>
            Discover collections that speak to your style
          </p>
          
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/shop"
              className="btn btn-primary"
              style={{
                padding: "18px 52px",
                fontSize: "1.2rem",
                background: "#fff",
                color: "#000",
                borderRadius: "50px",
                fontWeight: 700
              }}
            >
              Shop Now
            </Link>
            
            <Link
              to="/"
              className="btn"
              style={{
                padding: "18px 52px",
                fontSize: "1.2rem",
                border: "2px solid rgba(255,255,255,0.6)",
                color: "#fff",
                borderRadius: "50px",
                fontWeight: 600
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}