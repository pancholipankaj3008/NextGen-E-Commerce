


import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import { useState, useEffect } from "react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1800&q=90&fit=crop",
    label: "SS 26 — COLLECTION",
    title: "Dare to\nStand Out",
    subtitle: "Bold silhouettes for the unapologetically modern.",
    accent: "#E8C97E",
    cta: "Shop Women",
    tag: "NEW IN",
    position: "center 30%"
  },
  {
    img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1800&q=90&fit=crop",
    label: "MEN'S ESSENTIALS",
    title: "Quiet\nLuxury",
    subtitle: "Understated refinement. Crafted to last.",
    accent: "#A8C5DA",
    cta: "Shop Men",
    tag: "TRENDING",
  },
  {
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1800&q=90&fit=crop",
    label: "SUMMER DROP 2026",
    title: "Sun-Kissed\nEverywhere",
    subtitle: "Effortless looks for golden hour and beyond.",
    accent: "#F4A26A",
    cta: "Explore Drop",
    tag: "JUST DROPPED",
    position: "center 45%"
    
  },
  {
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800&q=90&fit=crop",
    label: "EDITORIAL — ICONS",
    title: "She Owns\nThe Room",
    subtitle: "Statement pieces for women who lead.",
    accent: "#C9A4D4",
    cta: "View Lookbook",
    tag: "EDITOR'S PICK",
    position: "center 7%"
  },
];

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
    setAnimKey((k) => k + 1);
  };

  const accent = slides[activeIndex]?.accent || "#fff";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Jost:wght@200;300;400;500&display=swap');

        :root {
          --accent: ${accent};
          --transition-speed: 0.6s;
        }

        .hero-swiper {
          width: 100%;
          height: 100vh;
        }

        .slide-img {
  width: 100%;
  height: 100%;
  object-fit: cover;

  /* Default for mobile */
  object-position: center top;

  transition: transform 6s ease-out;
  transform: scale(1.03);
}
  @media (min-width: 1024px) {
  .slide-img {
    object-position: center center; /* 👈 FACE SAFE */
  }
}

/* Active zoom */
.hero-swiper .swiper-slide-active .slide-img {
  transform: scale(1.25);
}


        /* Layered gradient overlay */
        .slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            rgba(0,0,0,0.72) 0%,
            rgba(0,0,0,0.38) 50%,
            rgba(0,0,0,0.10) 100%
          );
        }

        /* Vertical side accent line */
        .accent-line {
          position: absolute;
          left: 7vw;
          top: 50%;
          transform: translateY(-50%);
          width: 2px;
          height: 0;
          background: var(--accent);
          transition: height 0.9s cubic-bezier(0.77,0,0.18,1) 0.2s, background 0.5s;
        }

        .slide-active-content .accent-line {
          height: 120px;
        }

        /* Content area */
        .slide-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 calc(7vw + 28px);
          font-family: 'Jost', sans-serif;
          color: #fff;
        }

        /* Tag pill */
        .slide-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.25em;
          padding: 5px 14px;
          border: 1px solid var(--accent);
          color: var(--accent);
          border-radius: 100px;
          margin-bottom: 18px;
          width: fit-content;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s, border-color 0.5s, color 0.5s;
        }

        .slide-active-content .slide-tag {
          opacity: 1;
          transform: translateY(0);
        }

        /* Label */
        .slide-label {
          font-size: clamp(10px, 1.2vw, 13px);
          font-weight: 300;
          letter-spacing: 0.3em;
          opacity: 0.65;
          margin-bottom: 14px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s;
        }

        .slide-active-content .slide-label {
          opacity: 0.65;
          transform: translateY(0);
        }

        /* Title */
        .slide-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(48px, 7vw, 96px);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.02em;
          white-space: pre-line;
          margin-bottom: 20px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s;
        }

        .slide-active-content .slide-title {
          opacity: 1;
          transform: translateY(0);
        }

        /* Italic word styling */
        .slide-title em {
          font-style: italic;
          color: var(--accent);
          transition: color 0.5s;
        }

        /* Subtitle */
        .slide-subtitle {
          font-size: clamp(13px, 1.4vw, 17px);
          font-weight: 300;
          opacity: 0.8;
          max-width: 380px;
          line-height: 1.7;
          margin-bottom: 38px;
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .slide-active-content .slide-subtitle {
          opacity: 0.75;
          transform: translateY(0);
        }

        /* CTA Buttons */
        .slide-ctas {
          display: flex;
          align-items: center;
          gap: 20px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease 0.65s, transform 0.6s ease 0.65s;
        }

        .slide-active-content .slide-ctas {
          opacity: 1;
          transform: translateY(0);
        }

        .btn-primary {
          background: var(--accent);
          color: #000;
          border: none;
          padding: 14px 32px;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.3s, transform 0.3s;
        }

        .btn-primary:hover {
          opacity: 0.88;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: transparent;
          color: #fff;
          border: none;
          padding: 14px 0;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          transition: opacity 0.3s;
        }

        .btn-secondary::after {
          content: '';
          position: absolute;
          bottom: 10px;
          left: 0;
          width: 0;
          height: 1px;
          background: #fff;
          transition: width 0.3s ease;
        }

        .btn-secondary:hover::after { width: 100%; }
        .btn-secondary:hover { opacity: 0.75; }

        /* Slide counter */
        .slide-counter {
          position: absolute;
          bottom: 48px;
          left: 7vw;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .slide-counter .current {
          font-size: 20px;
          font-weight: 500;
          color: #fff;
          font-family: 'Playfair Display', serif;
          font-style: italic;
        }

        .counter-bar {
          width: 60px;
          height: 1px;
          background: rgba(255,255,255,0.2);
          position: relative;
        }

        .counter-bar-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: var(--accent);
          transition: width 5s linear, background 0.5s;
        }

        /* Pagination override */
        .hero-swiper .swiper-pagination {
          bottom: 48px;
          right: 7vw;
          left: auto;
          width: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: center;
        }

        .hero-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: rgba(255,255,255,0.35);
          border-radius: 50%;
          opacity: 1;
          transition: all 0.4s;
        }

        .hero-swiper .swiper-pagination-bullet-active {
          background: var(--accent);
          height: 24px;
          border-radius: 3px;
          transition: background 0.5s, height 0.4s;
        }

        /* Right panel: vertical text label */
        .vertical-label {
          position: absolute;
          right: 7vw;
          top: 50%;
          transform: translateY(-50%) rotate(90deg);
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.35em;
          color: rgba(255,255,255,0.35);
          white-space: nowrap;
          text-transform: uppercase;
          z-index: 10;
        }

        @media (max-width: 767px) {

        .slide-img {
  object-position: center top !important;
  transform: scale(1.02) !important;
}

          .vertical-label {
            right: -34%;
            top: 40%;
            font-size: 8px;
            letter-spacing: 0.18em;
          }

          .slide-content {
            padding: 0 20px 0 52px !important;
          }

          .accent-line {
            left: 20px !important;
          }

          .slide-counter {
            left: 20px !important;
          }

          .slide-title {
            font-size: clamp(36px, 11vw, 56px) !important;
          }

          .hero-swiper .swiper-pagination {
            right: 12px !important;
            bottom: 40px !important;
          }
        }

        /* Scroll hint */
        .scroll-hint {
          position: absolute;
          bottom: 44px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: 0.4;
          animation: scrollBounce 2s infinite;
        }

        .scroll-hint span {
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          letter-spacing: 0.25em;
          color: #fff;
          text-transform: uppercase;
        }

        .scroll-arrow {
          width: 1px;
          height: 28px;
          background: linear-gradient(to bottom, #fff, transparent);
        }

        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>

      <div style={{ width: "100%", height: "100vh", overflow: "hidden", position: "relative", background: "#000" }}>
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          speed={1100}
          className="hero-swiper"
          onSlideChange={handleSlideChange}
          onSwiper={(s) => setActiveIndex(s.realIndex)}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>

                {/* IMAGE */}
                <img src={slide.img} alt={slide.title} className="slide-img" style={{ objectPosition: slide.position || "center" }}/>

                {/* OVERLAY */}
                <div className="slide-overlay" />

                {/* Accent vertical line */}
                <div className={`accent-line ${activeIndex === index ? "slide-active-content" : ""}`} />

                {/* CONTENT */}
                <div className={`slide-content ${activeIndex === index ? "slide-active-content" : ""}`}
                  key={`${index}-${animKey}`}>

                  {/* Tag */}
                  <div className="slide-tag">{slide.tag}</div>

                  {/* Label */}
                  <div className="slide-label">{slide.label}</div>

                  {/* Title */}
                  <h1 className="slide-title">
                    {slide.title.split("\n").map((line, i) =>
                      i % 2 === 1 ? <span key={i}><em>{line}</em>{"\n"}</span> : <span key={i}>{line}{"\n"}</span>
                    )}
                  </h1>

                  {/* Subtitle */}
                  <p className="slide-subtitle">{slide.subtitle}</p>

                  {/* CTAs */}
                  <div className="slide-ctas">
                    <button className="btn-primary">{slide.cta}</button>
                    <button className="btn-secondary">View Lookbook →</button>
                  </div>
                </div>

                {/* Slide counter */}
                <div className="slide-counter">
                  <span className="current">0{index + 1}</span>
                  <div className="counter-bar">
                    {activeIndex === index && (
                      <div
                        className="counter-bar-fill"
                        key={animKey}
                        style={{ width: "100%", background: slide.accent }}
                      />
                    )}
                  </div>
                  <span>0{slides.length}</span>
                </div>

                {/* Vertical label */}
                <div className="vertical-label">Free Shipping · Returns Within 30 Days · Secure Checkout</div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Scroll hint */}
        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-arrow" />
        </div>
      </div>
    </>
  );
}