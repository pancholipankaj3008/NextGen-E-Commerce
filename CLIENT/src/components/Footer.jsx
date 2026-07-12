export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    Information: ["My Account", "Login", "My Order", "My Cart", "Checkout"],
    Service: ["About Us", "Delivery Policy", "Privacy Policy", "Refund Policy", "Terms & Condition"],
  };

  const socials = [
    { icon: "f", label: "Facebook", href: "#" },
    { icon: "IG", label: "Instagram", href: "#" },
    { icon: "in", label: "LinkedIn", href: "#" },
    { icon: "𝕏", label: "X / Twitter", href: "#" },
    { icon: "▶", label: "YouTube", href: "#" },
    { icon: "✉", label: "Email", href: "#" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');


        .ft-root {
          background: #0a0a0a;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        /* ── TOP SECTION ── */
        .ft-top {
          padding: 72px 148px 56px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: start;
          position: relative;
          z-index: 1;
        }

        /* Brand side */
        .ft-brand {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 420px;
        }

        .ft-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 9vw, 108px);
          letter-spacing: 0.04em;
          line-height: 0.88;
          position: relative;
          display: inline-block;
          width: fit-content;
        }

        /* Multi-layer logo split effect */
        .ft-logo-solid {
          color: #f0ede8;
          position: relative;
          z-index: 2;
        }

        /* Gradient fade on second half of text */
        .ft-logo-solid::after {
          content: 'REFLECT';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 40%,
            rgba(10,10,10,0.55) 62%,
            rgba(10,10,10,0.9) 78%,
            #0a0a0a 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          pointer-events: none;
          z-index: 3;
        }

        .ft-tagline {
          font-size: 12px;
          font-weight: 300;
          color: rgba(240,237,232,0.35);
          letter-spacing: 0.08em;
          line-height: 1.8;
          max-width: 280px;
        }

        /* Newsletter mini form */
        .ft-mini-form-label {
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c8f135;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ft-mini-form-label::before {
          content: '';
          width: 16px; height: 1px;
          background: #c8f135;
        }

        .ft-mini-form {
          display: flex;
          gap: 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 3px;
          overflow: hidden;
          max-width: 320px;
          transition: border-color 0.25s;
        }

        .ft-mini-form:focus-within {
          border-color: rgba(200,241,53,0.35);
        }

        .ft-mini-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 12px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 300;
          color: #f0ede8;
          letter-spacing: 0.03em;
        }

        .ft-mini-input::placeholder { color: rgba(240,237,232,0.22); }

        .ft-mini-submit {
          background: #c8f135;
          border: none;
          padding: 0 18px;
          color: #0a0a0a;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s, padding 0.2s;
          flex-shrink: 0;
        }

        .ft-mini-submit:hover {
          background: #d9ff4d;
          padding: 0 22px;
        }

        /* ── LINKS SIDE ── */
        .ft-links-grid {
          display: grid;
          grid-template-columns: repeat(3, auto);
          gap: 56px;
          align-items: start;
        }

        .ft-col-title {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(240,237,232,0.55);
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .ft-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ft-links li a {
          text-decoration: none;
          font-size: 13px;
          font-weight: 300;
          color: rgba(240,237,232,0.38);
          letter-spacing: 0.03em;
          transition: color 0.25s, padding-left 0.25s;
          display: block;
          position: relative;
        }

        .ft-links li a::before {
          content: '';
          position: absolute;
          left: -12px;
          top: 50%;
          transform: translateY(-50%);
          width: 4px; height: 1px;
          background: #c8f135;
          opacity: 0;
          transition: opacity 0.25s;
        }

        .ft-links li a:hover {
          color: #f0ede8;
          padding-left: 10px;
        }

        .ft-links li a:hover::before {
          opacity: 1;
        }

        /* Social icons column */
        .ft-social-col {}

        .ft-socials {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ft-social-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 4px;
          padding: 9px 14px;
          cursor: pointer;
          transition: background 0.25s, border-color 0.25s, transform 0.2s;
          text-decoration: none;
          width: 152px;
        }

        .ft-social-btn:hover {
          background: rgba(200,241,53,0.08);
          border-color: rgba(200,241,53,0.25);
          transform: translateX(4px);
        }

        .ft-social-icon {
          width: 24px; height: 24px;
          border-radius: 4px;
          background: rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
          color: rgba(240,237,232,0.7);
          flex-shrink: 0;
          font-family: 'DM Sans', sans-serif;
        }

        .ft-social-label {
          font-size: 11px;
          font-weight: 400;
          color: rgba(240,237,232,0.38);
          letter-spacing: 0.05em;
          transition: color 0.25s;
        }

        .ft-social-btn:hover .ft-social-label {
          color: #c8f135;
        }

        /* ── DIVIDER ── */
        .ft-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 0 52px;
          position: relative;
          z-index: 1;
        }

        /* ── BOTTOM BAR ── */
        .ft-bottom {
          padding: 20px 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }

        .ft-copyright {
          font-size: 11px;
          font-weight: 300;
          color: rgba(240,237,232,0.22);
          letter-spacing: 0.07em;
        }

        .ft-bottom-links {
          display: flex;
          gap: 24px;
        }

        .ft-bottom-links a {
          font-size: 10px;
          font-weight: 300;
          color: rgba(240,237,232,0.22);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          transition: color 0.25s;
        }

        .ft-bottom-links a:hover {
          color: rgba(240,237,232,0.6);
        }

        .ft-bottom-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          align-self: center;
        }

        /* Ghost watermark REFLECT behind everything */
        .ft-watermark {
          position: absolute;
          bottom: -30px;
          left: -10px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 220px;
          color: rgba(255,255,255,0.018);
          letter-spacing: 0.04em;
          pointer-events: none;
          white-space: nowrap;
          line-height: 1;
          z-index: 0;
          user-select: none;
        }

        /* Accent glow top-left */
        .ft-glow {
          position: absolute;
          top: 0; left: 0;
          width: 500px; height: 300px;
          background: radial-gradient(ellipse at 0% 0%, rgba(200,241,53,0.04) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* Responsive */
        @media (max-width: 1060px) {
          .ft-top { grid-template-columns: 1fr; }
          .ft-links-grid { grid-template-columns: repeat(3, auto); gap: 36px; }
        }

        @media (max-width: 700px) {
          .ft-top { padding: 52px 24px 40px; }
          .ft-divider, .ft-bottom { padding-left: 24px; padding-right: 24px; }
          .ft-links-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .ft-social-col { grid-column: 1 / -1; }
          .ft-socials { flex-direction: row; flex-wrap: wrap; }
          .ft-social-btn { width: auto; flex: 1; min-width: 120px; }
          .ft-bottom { flex-direction: column; gap: 12px; text-align: center; }
          .ft-bottom-links { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>

      <footer className="ft-root">
        <div className="ft-glow" />
        <div className="ft-watermark">NextGen</div>

        <div className="ft-top">

          {/* Left: Brand */}
          <div className="ft-brand">
            <div className="ft-logo">
              <span className="ft-logo-solid">NextGEN</span>
            </div>
            <p className="ft-tagline">
              Where every piece tells a story. Crafted for those who dress with intention
              and live without compromise.
            </p>
            <div>
              <div className="ft-mini-form-label">Stay in the loop</div>
              <div className="ft-mini-form">
                <input
                  className="ft-mini-input"
                  type="email"
                  placeholder="Your email address"
                />
                <button className="ft-mini-submit">→</button>
              </div>
            </div>
          </div>

          {/* Right: Links + Social */}
          <div className="ft-links-grid">

            {Object.entries(links).map(([col, items]) => (
              <div key={col}>
                <div className="ft-col-title">{col}</div>
                <ul className="ft-links">
                  {items.map((item) => (
                    <li key={item}><a href="#">{item}</a></li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="ft-social-col">
              <div className="ft-col-title">Follow Us</div>
              <div className="ft-socials">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} className="ft-social-btn">
                    <span className="ft-social-icon">{s.icon}</span>
                    <span className="ft-social-label">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="ft-divider" />

        <div className="ft-bottom">
          <span className="ft-copyright">
            © {currentYear} All Rights Reserved by Reflect Studio
          </span>
          <div className="ft-bottom-links">
            <a href="#">Privacy</a>
            <span className="ft-bottom-dot" />
            <a href="#">Terms</a>
            <span className="ft-bottom-dot" />
            <a href="#">Cookies</a>
            <span className="ft-bottom-dot" />
            <a href="#">Sitemap</a>
          </div>
        </div>
      </footer>
    </>
  );
}