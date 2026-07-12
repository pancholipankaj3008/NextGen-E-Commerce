
export default function CollectionGrid() {


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        

        .cg-section {
          background: #0e0e0e;
          padding: 40px 148px;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Section header */
        .cg-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .cg-header-left {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cg-eyebrow {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #b8976a;
        }

        .cg-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 300;
          color: #f0ede8;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .cg-heading em {
          font-style: italic;
          color: #b8976a;
        }

        .cg-view-all {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #666;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.3s;
          cursor: pointer;
          background: none;
          border: none;
        }

        .cg-view-all::after {
          content: '→';
          font-size: 14px;
          transition: transform 0.3s;
        }

        .cg-view-all:hover { color: #b8976a; }
        .cg-view-all:hover::after { transform: translateX(4px); }

        /* ─── GRID LAYOUT ─── */
        .cg-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1.1fr;
          grid-template-rows: auto;
          gap: 14px;
          align-items: stretch;
        }

        /* ─── TALL CARDS (col 1 & 2) ─── */
        .cg-card-tall {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          aspect-ratio: 3/4.2;
          cursor: pointer;
          background: #1a1a1a;
        }

        .cg-card-tall img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          filter: brightness(0.88) saturate(0.9);
        }

        .cg-card-tall:hover img {
          transform: scale(1.06);
          filter: brightness(0.95) saturate(1.05);
        }

        /* Gradient overlay on tall cards */
        .cg-card-tall .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.78) 0%,
            rgba(0,0,0,0.18) 45%,
            transparent 70%
          );
          transition: opacity 0.4s;
        }

        /* Gold top-left corner accent */
        .cg-card-tall .corner-accent {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 28px;
          height: 28px;
          border-top: 1.5px solid rgba(184,151,106,0.6);
          border-left: 1.5px solid rgba(184,151,106,0.6);
          opacity: 0;
          transition: opacity 0.4s 0.1s;
        }

        .cg-card-tall:hover .corner-accent { opacity: 1; }

        /* Season tag */
        .cg-card-tall .season-tag {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(240,237,232,0.55);
          writing-mode: vertical-rl;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
        }

        /* Bottom content */
        .cg-card-tall .card-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .cg-card-tall .card-label {
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #b8976a;
          font-weight: 400;
        }

        .cg-card-tall .card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 2.5vw, 32px);
          font-weight: 300;
          color: #f0ede8;
          line-height: 1.2;
        }

        .cg-card-tall .explore-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #f0ede8;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
          transition: gap 0.3s;
          margin-top: 4px;
          width: fit-content;
        }

        .explore-btn .arrow-line {
          width: 28px;
          height: 1px;
          background: #b8976a;
          position: relative;
          transition: width 0.3s;
          flex-shrink: 0;
        }

        .explore-btn .arrow-line::after {
          content: '';
          position: absolute;
          right: 0;
          top: -3px;
          width: 6px;
          height: 6px;
          border-top: 1px solid #b8976a;
          border-right: 1px solid #b8976a;
          transform: rotate(45deg);
        }

        .cg-card-tall:hover .explore-btn { gap: 14px; }
        .cg-card-tall:hover .arrow-line { width: 38px; }

        /* ─── RIGHT COLUMN (stacked banners) ─── */
        .cg-right-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cg-card-banner {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          background: #1a1716;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          min-height: 200px;
        }

        /* Background image fills the right half */
        .cg-card-banner .banner-img-wrap {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 46%;
          overflow: hidden;
        }

        .cg-card-banner .banner-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          filter: brightness(0.82) saturate(0.85);
        }

        .cg-card-banner:hover .banner-img-wrap img {
          transform: scale(1.07);
        }

        /* Gradient from left */
        .cg-card-banner .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            #1a1716 40%,
            rgba(26,23,22,0.75) 65%,
            transparent 100%
          );
        }

        /* Top accent strip */
        .cg-card-banner .banner-top-strip {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(to right, #b8976a, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .cg-card-banner:hover .banner-top-strip { opacity: 1; }

        .cg-card-banner .banner-content {
          position: relative;
          z-index: 2;
          padding: 28px 30px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
          max-width: 58%;
        }

        .banner-eyebrow {
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #b8976a;
        }

        .banner-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 2vw, 26px);
          font-weight: 300;
          color: #f0ede8;
          line-height: 1.25;
        }

        .banner-desc {
          font-size: 11px;
          color: rgba(240,237,232,0.45);
          font-weight: 300;
          letter-spacing: 0.02em;
          line-height: 1.6;
        }

        .banner-btn {
          display: inline-flex;
          align-items: center;
          gap: 0;
          margin-top: 6px;
          background: none;
          border: 1px solid rgba(184,151,106,0.35);
          color: #b8976a;
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 9px 18px;
          cursor: pointer;
          width: fit-content;
          transition: background 0.3s, border-color 0.3s, color 0.3s;
        }

        .banner-btn:hover {
          background: #b8976a;
          border-color: #b8976a;
          color: #0e0e0e;
        }

        /* Bottom row meta strip */
        .cg-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .cg-meta-tag {
          font-size: 10px;
          color: rgba(240,237,232,0.3);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 300;
        }

        .cg-meta-dots {
          display: flex;
          gap: 6px;
        }

        .cg-meta-dots span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
        }

        .cg-meta-dots span:first-child {
          background: #b8976a;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .cg-section { padding: 48px 24px; }
          .cg-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto;
          }
          .cg-right-col {
            grid-column: 1 / -1;
            flex-direction: row;
          }
          .cg-card-banner { min-height: 160px; }
        }

        @media (max-width: 600px) {
          .cg-section { padding: 36px 16px; }
          .cg-grid { grid-template-columns: 1fr; }
          .cg-right-col { flex-direction: column; }
          .cg-card-tall { aspect-ratio: 3/4; }
        }
      `}</style>

      <section className="cg-section">

        {/* Header */}
        <div className="cg-header">
          <div className="cg-header-left">
            <span className="cg-eyebrow">Winter 2026 — New Arrivals</span>
            <h2 className="cg-heading">Curated <em>Collections</em></h2>
          </div>
          <button className="cg-view-all">View All</button>
        </div>

        {/* Grid */}
        <div className="cg-grid">

          {/* TALL CARD 1 — Women */}
          <div className="cg-card-tall">
            <img
              src="https://i.pinimg.com/1200x/25/6c/e4/256ce46e8c6b514a6823686743cda72a.jpg"
              alt="Women's Collection"
            />
            <div className="overlay" />
            <div className="corner-accent" />
            <span className="season-tag">W — 26</span>
            <div className="card-footer">
              <span className="card-label">Women's Edit</span>
              <h3 className="card-title">Autumn<br/>Essentials</h3>
              <button className="explore-btn">
                Explore
                <span className="arrow-line" />
              </button>
            </div>
          </div>

          {/* TALL CARD 2 — Street */}
          <div className="cg-card-tall">
            <img
              src="https://i.pinimg.com/736x/69/89/3c/69893c49d48e98399fcdea8ac724e72f.jpg"
              alt="Men's Collection"
            />
            <div className="overlay" />
            <div className="corner-accent" />
            <span className="season-tag">M — 26</span>
            <div className="card-footer">
              <span className="card-label">Men's Edit</span>
              <h3 className="card-title">Quiet<br/>Luxury</h3>
              <button className="explore-btn">
                Explore
                <span className="arrow-line" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN — two banners */}
          <div className="cg-right-col">

            {/* Banner 1 */}
            <div className="cg-card-banner">
              <div className="banner-top-strip" />
              <div className="banner-img-wrap">
                <img
                  src="https://i.pinimg.com/736x/a2/14/fc/a214fca52d8c83d74156ee621d83fe3c.jpg"
                  alt="Woman Collection"
                />
              </div>
              <div className="banner-overlay" />
              <div className="banner-content">
                <span className="banner-eyebrow">Woman Collection</span>
                <h4 className="banner-title">Stylish Winter<br/>T-Shirt for Women</h4>
                <p className="banner-desc">Cozy knits & bold silhouettes for the season.</p>
                <button className="banner-btn">Check Now</button>
              </div>
            </div>

            {/* Banner 2 */}
            <div className="cg-card-banner">
              <div className="banner-top-strip" />
              <div className="banner-img-wrap">
                <img
                  src="https://i.pinimg.com/736x/f5/68/79/f5687946b7857a72da1db4c1c3801b35.jpg"
                  alt="Man Collection"
                />
              </div>
              <div className="banner-overlay" />
              <div className="banner-content">
                <span className="banner-eyebrow">Man Collection</span>
                <h4 className="banner-title">Stylish Winter<br/>Shirt for Men</h4>
                <p className="banner-desc">Refined layers crafted for the modern man.</p>
                <button className="banner-btn">Check Now</button>
              </div>
            </div>

          </div>
        </div>

        {/* Meta strip */}
        <div className="cg-meta">
          <span className="cg-meta-tag">Free shipping on orders over ₹2,499</span>
          <div className="cg-meta-dots">
            <span /><span /><span /><span />
          </div>
          <span className="cg-meta-tag">New drops every Friday</span>
        </div>

      </section>
    </>
  );
}