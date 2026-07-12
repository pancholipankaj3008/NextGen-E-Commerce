import { useState } from "react";
import { SubscribeNewsletter as subscribeNewsletter } from "../features/newsletter/newsletterThunk";
import { useAppDispatch } from "../hooks/reduxHooks";

export default function PromoNewsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    if (email.includes("@")) {
      dispatch(subscribeNewsletter(email)).then((result) => {
        if (result.payload?.success) {
          setSubmitted(true);
          setEmail("");
        }
      });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');


        .pn-root {
          background: #0a0a0a;
          font-family: 'DM Sans', sans-serif;
          padding: 70px 148px 80px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ═══════════════════════════
           PROMO BANNER
        ═══════════════════════════ */
        .pn-promo {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          background: #141414;
          display: grid;
          grid-template-columns: 420px 1fr;
          min-height: 380px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        /* Subtle noise */
        .pn-promo::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 70% 50%, rgba(200,241,53,0.06) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Image side ── */
        .pn-promo-img {
          position: relative;
          overflow: hidden;
          background: #1e1c1a;
        }

        .pn-promo-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          filter: brightness(0.92) saturate(0.88);
          transition: transform 1s ease, filter 0.5s;
        }

        .pn-promo:hover .pn-promo-img img {
          transform: scale(1.04);
          filter: brightness(1) saturate(1);
        }

        /* floating tag on image */
        .pn-img-tag {
          position: absolute;
          bottom: 22px;
          left: 22px;
          background: rgba(10,10,10,0.7);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          padding: 7px 16px;
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pn-img-tag .live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #c8f135;
          box-shadow: 0 0 6px #c8f135;
          animation: blink 2s infinite;
          flex-shrink: 0;
        }

        @keyframes blink {
          0%,100% { opacity:1; } 50% { opacity:0.3; }
        }

        /* ── Text side ── */
        .pn-promo-content {
          position: relative;
          z-index: 1;
          padding: 52px 56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0;
        }

        .pn-promo-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c8f135;
          margin-bottom: 20px;
        }

        .pn-promo-eyebrow::before {
          content: '';
          width: 20px; height: 1px;
          background: #c8f135;
        }

        /* Big discount callout */
        .pn-discount-row {
          display: flex;
          align-items: flex-start;
          gap: 0;
          margin-bottom: 4px;
        }

        .pn-discount-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(72px, 9vw, 120px);
          line-height: 0.85;
          color: #f0ede8;
          letter-spacing: -0.01em;
        }

        .pn-discount-pct {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px, 3.5vw, 44px);
          color: #c8f135;
          margin-top: 8px;
          letter-spacing: 0.02em;
        }

        .pn-promo-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px, 3.8vw, 52px);
          color: #f0ede8;
          letter-spacing: 0.04em;
          line-height: 1.05;
          margin-bottom: 6px;
        }

        .pn-promo-title .outline {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(240,237,232,0.35);
        }

        .pn-promo-meta {
          font-size: 11px;
          font-weight: 300;
          color: rgba(240,237,232,0.35);
          letter-spacing: 0.05em;
          margin-bottom: 36px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pn-promo-meta::before {
          content: '⏱';
          font-size: 11px;
        }

        /* Countdown row */
        .pn-countdown {
          display: flex;
          gap: 12px;
          margin-bottom: 40px;
        }

        .pn-cd-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 5px;
          padding: 10px 14px;
          min-width: 58px;
        }

        .pn-cd-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          color: #f0ede8;
          line-height: 1;
          letter-spacing: 0.05em;
        }

        .pn-cd-label {
          font-size: 8px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(240,237,232,0.3);
        }

        .pn-cd-sep {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          color: rgba(240,237,232,0.2);
          align-self: center;
          padding-bottom: 8px;
        }

        /* CTA */
        .pn-ctas {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .pn-btn-primary {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 14px 32px;
          background: #c8f135;
          color: #0a0a0a;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          transition: background 0.25s, transform 0.2s;
        }

        .pn-btn-primary:hover {
          background: #d9ff4d;
          transform: translateY(-2px);
        }

        .pn-btn-ghost {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(240,237,232,0.35);
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.25s;
        }

        .pn-btn-ghost::after { content: '→'; font-size: 14px; }
        .pn-btn-ghost:hover { color: #f0ede8; }


        /* ═══════════════════════════
           NEWSLETTER
        ═══════════════════════════ */
        .pn-nl {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
          background: #111;
          padding: 64px 56px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }

        /* Background text watermark */
        .pn-nl::after {
          content: 'SUBSCRIBE';
          position: absolute;
          right: -24px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 160px;
          color: rgba(255,255,255,0.022);
          letter-spacing: 0.04em;
          pointer-events: none;
          white-space: nowrap;
          line-height: 1;
        }

        .pn-nl-left {
          position: relative;
          z-index: 1;
        }

        .pn-nl-eyebrow {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c8f135;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pn-nl-eyebrow::before {
          content: '';
          width: 20px; height: 1px;
          background: #c8f135;
        }

        .pn-nl-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 4.5vw, 62px);
          color: #f0ede8;
          letter-spacing: 0.02em;
          line-height: 0.9;
          margin-bottom: 18px;
        }

        .pn-nl-title .outline {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(240,237,232,0.3);
        }

        .pn-nl-desc {
          font-size: 13px;
          font-weight: 300;
          color: rgba(240,237,232,0.38);
          line-height: 1.8;
          max-width: 320px;
        }

        /* Perks */
        .pn-nl-perks {
          display: flex;
          gap: 20px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .pn-perk {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 10px;
          letter-spacing: 0.06em;
          color: rgba(240,237,232,0.38);
        }

        .pn-perk-icon {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: rgba(200,241,53,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: #c8f135;
          flex-shrink: 0;
        }

        /* Right: form */
        .pn-nl-right {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pn-form-label {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(240,237,232,0.3);
          margin-bottom: 4px;
        }

        .pn-input-row {
          display: flex;
          gap: 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          overflow: hidden;
          transition: border-color 0.25s;
        }

        .pn-input-row:focus-within {
          border-color: rgba(200,241,53,0.45);
        }

        .pn-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 16px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: #f0ede8;
          letter-spacing: 0.03em;
        }

        .pn-input::placeholder { color: rgba(240,237,232,0.25); }

        .pn-submit {
          background: #c8f135;
          border: none;
          padding: 0 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #0a0a0a;
          transition: background 0.25s, padding 0.25s;
          flex-shrink: 0;
        }

        .pn-submit:hover { background: #d9ff4d; padding: 0 28px; }

        .pn-success {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(200,241,53,0.08);
          border: 1px solid rgba(200,241,53,0.25);
          border-radius: 4px;
          font-size: 13px;
          font-weight: 400;
          color: #c8f135;
          letter-spacing: 0.03em;
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity:0; transform:translateY(6px); }
          to { opacity:1; transform:translateY(0); }
        }

        .pn-nl-disclaimer {
          font-size: 10px;
          font-weight: 300;
          color: rgba(240,237,232,0.2);
          line-height: 1.6;
          letter-spacing: 0.02em;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .pn-root { padding: 0 24px 60px; }
          .pn-promo { grid-template-columns: 1fr; min-height: auto; }
          .pn-promo-img { aspect-ratio: 16/9; }
          .pn-promo-content { padding: 40px 32px; }
          .pn-nl { grid-template-columns: 1fr; padding: 44px 32px; gap: 36px; }
        }

        @media (max-width: 520px) {
          .pn-discount-num { font-size: 80px; }
          .pn-countdown { gap: 8px; }
          .pn-cd-unit { min-width: 48px; padding: 8px 10px; }
        }
      `}</style>

      <div className="pn-root">

        {/* ── PROMO BANNER ── */}
        <div className="pn-promo">
          <div className="pn-promo-img">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800&q=90&fit=crop"
              alt="New Arrival"
            />
            <div className="pn-img-tag">
              <span className="live-dot" />
              Limited Time Offer
            </div>
          </div>

          <div className="pn-promo-content">
            <div className="pn-promo-eyebrow">Exclusive Deal</div>

            <div className="pn-discount-row">
              <span className="pn-discount-num">30</span>
              <span className="pn-discount-pct">%<br/>OFF</span>
            </div>

            <div className="pn-promo-title">
              ON ALL <span className="outline">NEW</span><br />ARRIVALS
            </div>

            <div className="pn-promo-meta">Offer ends 30 September 2026</div>

            {/* Countdown */}
            <div className="pn-countdown">
              <div className="pn-cd-unit">
                <span className="pn-cd-num">07</span>
                <span className="pn-cd-label">Days</span>
              </div>
              <span className="pn-cd-sep">:</span>
              <div className="pn-cd-unit">
                <span className="pn-cd-num">14</span>
                <span className="pn-cd-label">Hrs</span>
              </div>
              <span className="pn-cd-sep">:</span>
              <div className="pn-cd-unit">
                <span className="pn-cd-num">32</span>
                <span className="pn-cd-label">Min</span>
              </div>
              <span className="pn-cd-sep">:</span>
              <div className="pn-cd-unit">
                <span className="pn-cd-num">48</span>
                <span className="pn-cd-label">Sec</span>
              </div>
            </div>

            <div className="pn-ctas">
              <button className="pn-btn-primary">Explore Now</button>
              <button className="pn-btn-ghost">View Collection</button>
            </div>
          </div>
        </div>

        {/* ── NEWSLETTER ── */}
        <div className="pn-nl">
          <div className="pn-nl-left">
            <div className="pn-nl-eyebrow">Stay in the loop</div>
            <h3 className="pn-nl-title">
              SUBSCRIBE<br /><span className="outline">OUR</span><br />NEWSLETTER
            </h3>
            <p className="pn-nl-desc">
              Stay connected with the latest trends, exclusive offers, and
              behind-the-scenes updates. Be the first to discover new collections
              and promotions tailored just for you.
            </p>
            <div className="pn-nl-perks">
              <div className="pn-perk">
                <span className="pn-perk-icon">✦</span>
                Early Access
              </div>
              <div className="pn-perk">
                <span className="pn-perk-icon">✦</span>
                Exclusive Offers
              </div>
              <div className="pn-perk">
                <span className="pn-perk-icon">✦</span>
                No Spam
              </div>
            </div>
          </div>

          <div className="pn-nl-right">
            <div className="pn-form-label">Your email address</div>

            {!submitted ? (
              <>
                <div className="pn-input-row">
                  <input
                    className="pn-input"
                    type="email"
                    placeholder="Enter your email address here"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                  <button className="pn-submit" onClick={handleSubmit}>→</button>
                </div>
                <p className="pn-nl-disclaimer">
                  By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
                </p>
              </>
            ) : (
              <div className="pn-success">
                ✓ &nbsp;You're in! Welcome to the Reflect community.
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
