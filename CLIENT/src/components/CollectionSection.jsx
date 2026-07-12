import { useState } from "react";

const categories = ["Hoodie", "Caps & Bags", "Trending", "Out Wear", "Accessories"];

const products = [
  {
    id: 1,
    name: "Men BLVCK Grey Hoodie",
    price: 180,
    tag: "Classic",
    img: "https://i.pinimg.com/1200x/ce/1e/16/ce1e16c5abcbfd6aa872f8bbb49a06c4.jpg",
  },
  {
    id: 2,
    name: "LHR London England Hoodie",
    price: 250,
    tag: "Hot",
    img: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&q=85&fit=crop",
  },
  {
    id: 3,
    name: "Retro Rapper Tupac Hoodie",
    price: 100,
    tag: "Limited",
    img: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600&q=85&fit=crop",
  },
  {
    id: 4,
    name: "Hip Hop Street Wear Hoodie",
    price: 120,
    tag: "New",
    img: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&q=85&fit=crop",
  },
];

export default function CollectionSection() {
  const [activeTab, setActiveTab] = useState("Hoodie");
  const [hoveredId, setHoveredId] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (id) => {
    setCartItems((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');


        .cs-wrap {
          background: #f7f5f2;
          padding: 72px 148px 80px;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
        }

        /* ── HEADER ── */
        .cs-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: start;
          gap: 24px;
          margin-bottom: 52px;
        }

        .cs-title-block {}

        .cs-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 10px;
        }

        .cs-eyebrow::before {
          content: '';
          width: 24px;
          height: 1px;
          background: #888;
        }

        .cs-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 7vw, 88px);
          letter-spacing: 0.02em;
          color: #0d0d0d;
          line-height: 0.92;
        }

        .cs-title span {
          color: transparent;
          -webkit-text-stroke: 1.5px #0d0d0d;
        }

        .cs-desc-block {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding-top: 8px;
        }

        .cs-desc {
          font-size: 13px;
          font-weight: 300;
          color: #666;
          line-height: 1.75;
          max-width: 380px;
          margin-left: auto;
        }

        .cs-count {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          color: #bbb;
          margin-top: 16px;
          margin-left: auto;
        }

        /* ── TABS ── */
        .cs-tabs {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .cs-tab {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 9px 22px;
          border-radius: 100px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.25s;
          background: none;
        }

        .cs-tab.active {
          background: #0d0d0d;
          color: #f7f5f2;
          border-color: #0d0d0d;
        }

        .cs-tab:not(.active) {
          color: #555;
          border-color: #ddd;
          background: #fff;
        }

        .cs-tab:not(.active):hover {
          border-color: #0d0d0d;
          color: #0d0d0d;
        }

        /* ── PRODUCT GRID ── */
        .cs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        /* ── PRODUCT CARD ── */
        .cs-card {
          position: relative;
          background: #fff;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94),
                      box-shadow 0.4s;
        }

        .cs-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.12);
        }

        /* Image container */
        .cs-card-img {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: #ece9e3;
        }

        .cs-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
          filter: saturate(0.9);
        }

        .cs-card:hover .cs-card-img img {
          transform: scale(1.07);
        }

        /* Tag badge */
        .cs-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 100px;
          z-index: 2;
        }

        .badge-hot    { background: #ff3c2f; color: #fff; }
        .badge-new    { background: #0d0d0d; color: #fff; }
        .badge-limited { background: #b8976a; color: #fff; }
        .badge-classic { background: rgba(255,255,255,0.85); color: #0d0d0d; border: 1px solid #e0e0e0; }

        /* Hover overlay with actions */
        .cs-card-actions {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(13,13,13,0.46);
          backdrop-filter: blur(2px);
          opacity: 0;
          transition: opacity 0.35s;
          z-index: 3;
        }

        .cs-card:hover .cs-card-actions {
          opacity: 1;
        }

        .action-btn {
          width: 160px;
          padding: 12px 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          border-radius: 3px;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          transform: translateY(12px);
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.2s;
        }

        .cs-card:hover .action-btn {
          transform: translateY(0);
        }

        .cs-card:hover .action-btn:nth-child(2) {
          transition-delay: 0.05s;
        }

        .action-btn-cart {
          background: #fff;
          color: #0d0d0d;
        }

        .action-btn-cart:hover { background: #f0ede8; }

        .action-btn-buy {
          background: #0d0d0d;
          color: #fff;
        }

        .action-btn-buy:hover { background: #333; }

        .action-btn-added {
          background: #2ecc71 !important;
          color: #fff !important;
        }

        /* Card footer */
        .cs-card-footer {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cs-card-name {
          font-size: 13px;
          font-weight: 500;
          color: #1a1a1a;
          line-height: 1.35;
        }

        .cs-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cs-card-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 0.05em;
          color: #0d0d0d;
        }

        .cs-card-price span {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          color: #999;
          letter-spacing: 0;
          margin-left: 2px;
        }

        /* Quick wish icon */
        .cs-wish {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #eee;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.2s;
        }

        .cs-wish:hover { border-color: #ff3c2f; transform: scale(1.1); }

        /* ── BOTTOM BANNER ── */
        .cs-banner {
          margin-top: 60px;
          border-radius: 6px;
          background: #0d0d0d;
          padding: 52px 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        /* Decorative background text */
        .cs-banner::before {
          content: 'NEXTGEN';
          position: absolute;
          right: -20px;
          bottom: -30px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 180px;
          color: rgba(255,255,255,0.03);
          letter-spacing: 0.05em;
          pointer-events: none;
          line-height: 1;
          white-space: nowrap;
        }

        .cs-banner-left {}

        .cs-banner-eyebrow {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #b8976a;
          margin-bottom: 12px;
        }

        .cs-banner-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 5vw, 68px);
          color: #f7f5f2;
          line-height: 0.9;
          letter-spacing: 0.02em;
        }

        .cs-banner-title em {
          color: transparent;
          -webkit-text-stroke: 1px #f7f5f2;
          font-style: normal;
        }

        .cs-banner-desc {
          font-size: 13px;
          font-weight: 300;
          color: rgba(247,245,242,0.45);
          max-width: 340px;
          line-height: 1.7;
          margin-top: 16px;
        }

        .cs-banner-right {
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: flex-end;
          flex-shrink: 0;
        }

        .cs-banner-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 14px 32px;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.25s;
        }

        .cs-banner-btn-primary {
          background: #f7f5f2;
          color: #0d0d0d;
          border: 1px solid #f7f5f2;
        }

        .cs-banner-btn-primary:hover {
          background: #b8976a;
          border-color: #b8976a;
          color: #fff;
        }

        .cs-banner-btn-secondary {
          background: transparent;
          color: rgba(247,245,242,0.5);
          border: 1px solid rgba(247,245,242,0.18);
        }

        .cs-banner-btn-secondary:hover {
          border-color: rgba(247,245,242,0.5);
          color: #f7f5f2;
        }

        /* Responsive */
        @media (max-width: 960px) {
          .cs-grid { grid-template-columns: repeat(2, 1fr); }
          .cs-header { grid-template-columns: 1fr; }
          .cs-desc { margin-left: 0; }
          .cs-count { margin-left: 0; }
          .cs-banner { flex-direction: column; align-items: flex-start; gap: 28px; }
          .cs-banner-right { align-items: flex-start; }
        }

        @media (max-width: 560px) {
          .cs-wrap { padding: 40px 20px 60px; }
          .cs-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .cs-banner { padding: 36px 28px; }
        }
      `}</style>

      <section className="cs-wrap">

        {/* Header */}
        <div className="cs-header">
          <div className="cs-title-block">
            <div className="cs-eyebrow">Winter 2026</div>
            <h2 className="cs-title">OUR<br /><span>COLLECTION</span></h2>
          </div>
          <div className="cs-desc-block">
            <p className="cs-desc">
              Step into the world of Reflect, where each collection tells its own story.
              From minimalist essentials to bold statement pieces, curated to suit every
              occasion and style.
            </p>
            <div className="cs-count">{products.length} PIECES — HOODIE EDIT</div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="cs-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cs-tab ${activeTab === cat ? "active" : ""}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="cs-grid">
          {products.map((product) => {
            const added = cartItems.includes(product.id);
            return (
              <div
                key={product.id}
                className="cs-card"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="cs-card-img">
                  <img src={product.img} alt={product.name} />

                  {/* Badge */}
                  <div className={`cs-badge badge-${product.tag.toLowerCase()}`}>
                    {product.tag}
                  </div>

                  {/* Hover actions */}
                  <div className="cs-card-actions">
                    <button
                      className={`action-btn action-btn-cart ${added ? "action-btn-added" : ""}`}
                      onClick={() => addToCart(product.id)}
                    >
                      {added ? "✓ Added" : "Add to Cart"}
                    </button>
                    <button className="action-btn action-btn-buy">Buy Now</button>
                  </div>
                </div>

                <div className="cs-card-footer">
                  <div className="cs-card-name">{product.name}</div>
                  <div className="cs-card-bottom">
                    <div className="cs-card-price">
                      ${product.price}<span>USD</span>
                    </div>
                    <button className="cs-wish">♡</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="cs-banner">
          <div className="cs-banner-left">
            <div className="cs-banner-eyebrow">Cloth & Footwear</div>
            <div className="cs-banner-title">
              CLOTH AND<br /><em>FOOTWEAR</em><br />COLLECTION
            </div>
            <p className="cs-banner-desc">
              We offer more than just clothing and footwear — we provide a canvas
              for your individuality. Designed apparel that lets you make a
              statement with every step.
            </p>
          </div>
          <div className="cs-banner-right">
            <button className="cs-banner-btn cs-banner-btn-primary">Explore All</button>
            <button className="cs-banner-btn cs-banner-btn-secondary">View Lookbook</button>
          </div>
        </div>

      </section>
    </>
  );
}