import React, { useState, useMemo } from "react";
import { Search, User, ShoppingBag, ChevronDown, List, Grid3x3, Heart, Repeat, Maximize2, ArrowLeft, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

/**
 * CollectionPage
 * ---------------
 * Generic, reusable "collection / shop" page in the Durotan visual style.
 * Men's, Women's and Kids' pages are thin wrappers that pass in their own
 * `config` object (hero copy, categories, filters, products...).
 *
 * Usage:
 *   <CollectionPage config={mensConfig} />
 *
 * MOBILE LAYOUT NOTE:
 * On screens <= 768px this now renders a Flipkart-style shop header:
 * back arrow + title + search/wishlist/bag icons, a Sort | Filter row,
 * a horizontally scrollable category chip row, and product cards with
 * always-visible wishlist heart, a rating badge on the image, and a
 * discount tag — all restyled in Durotan's ink / olive-gold palette
 * instead of the original bright reference colours.
 */

const Star = ({ filled }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill={filled ? "#B89A6A" : "none"} stroke="#B89A6A" strokeWidth="1.5">
    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7-5.4-4.7 7.1-.6L12 2z" />
  </svg>
);

export default function CollectionPage({ config }) {
  const {
    brandName = "DUROTAN",
    navLinks = ["Shop", "Product", "Blog", "Pages"],
    heroEyebrow,
    heroTitle,
    heroSubtitle,
    heroImage,
    categories = [],
    materials = [],
    colors = [],
    sizes = [],
    priceRange = { min: 99, max: 499 },
    products = [],
    recentlyViewed = [],
    accent = "#B89A6A",
  } = config;

  const [activeCategory, setActiveCategory] = useState(
    categories.find((c) => c.active)?.label || categories[0]?.label
  );
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(2);
  const [checkedMaterials, setCheckedMaterials] = useState(() =>
    materials.filter((m) => m.checked).map((m) => m.label)
  );
  const [checkedColors, setCheckedColors] = useState(() =>
    colors.filter((c) => c.checked).map((c) => c.label)
  );
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Mobile collapse state. On mobile: sidebar sections start closed.
  // On desktop these are ignored (CSS always shows the content).
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    categories: false,
    materials: false,
    colors: false,
    size: false,
    price: false,
  });

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggle = (val, list, setList) =>
    setList(list.includes(val) ? list.filter((v) => v !== val) : [...list, val]);

  const totalPages = 4;

  const styles = useMemo(
    () => ({
      "--accent": accent,
    }),
    [accent]
  );

  const discountPct = (p) =>
    p.salePrice ? Math.round((1 - p.salePrice / p.price) * 100) : null;

  return (
    <div style={styles} className="durotan-page">
      <style>{`
        .durotan-page {
          --ink: #2b2722;
          --ink-soft: #6b655c;
          --line: #e7e2d9;
          --bg: #ffffff;
          --bg-muted: #f4f1ea;
          --price-strike: #aaa49a;
          font-family: 'Jost', 'Helvetica Neue', Arial, sans-serif;
          color: var(--ink);
          background: var(--bg);
          -webkit-font-smoothing: antialiased;
        }
        .durotan-page * { box-sizing: border-box; }
        .durotan-page a { text-decoration: none; color: inherit; }
        .durotan-page button { font-family: inherit; cursor: pointer; }

        /* ---------- Header ---------- */
        .dt-header {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 56px;
          color: #fff;
        }
        .dt-logo {
          font-size: 22px;
          letter-spacing: 0.22em;
          font-weight: 500;
        }
        .dt-nav {
          display: flex;
          gap: 38px;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .dt-nav span.current {
          background: #1c1a17;
          padding: 9px 16px;
          border-radius: 2px;
        }
        .dt-icons {
          display: flex;
          align-items: center;
          gap: 22px;
        }
        .dt-icons .lang { font-size: 12px; letter-spacing: 0.08em; }
        .dt-icons .bag-wrap { position: relative; }
        .dt-icons .bag-dot {
          position: absolute;
          top: -5px;
          right: -7px;
          background: var(--accent);
          color: #1c1a17;
          font-size: 9px;
          font-weight: 700;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ---------- Mobile top bar (Flipkart-style, hidden on desktop) ---------- */
        .dt-m-topbar {
          display: none;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 14px 16px;
          background: #1c1a17;
          color: #fff;
          position: sticky;
          top: 0;
          z-index: 20;
        }
        .dt-m-topbar-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .dt-m-topbar-left button {
          background: none; border: none; color: #fff; display: flex; padding: 2px;
        }
        .dt-m-topbar-title {
          font-size: 15px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .dt-m-topbar-icons { display: flex; align-items: center; gap: 18px; flex-shrink: 0; }
        .dt-m-topbar-icons button { background: none; border: none; color: #fff; display: flex; position: relative; padding: 2px; }
        .dt-m-topbar-icons .dot {
          position: absolute; top: -3px; right: -5px;
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--accent);
        }

        /* ---------- Mobile sort/filter row ---------- */
        .dt-m-sortfilter {
          display: none;
          border-bottom: 1px solid var(--line);
        }
        .dt-m-sortfilter button {
          flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          background: #fff; border: none;
          padding: 13px 10px;
          font-size: 12.5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }
        .dt-m-sortfilter button.active { color: var(--ink); font-weight: 600; }
        .dt-m-sortfilter button:first-child { border-right: 1px solid var(--line); }

        /* ---------- Mobile category chip row ---------- */
        .dt-m-chips {
          display: none;
          gap: 10px;
          padding: 14px 16px;
          overflow-x: auto;
          scrollbar-width: none;
          border-bottom: 1px solid var(--line);
        }
        .dt-m-chips::-webkit-scrollbar { display: none; }
        .dt-m-chip {
          flex-shrink: 0;
          display: flex; align-items: center; gap: 6px;
          padding: 9px 16px;
          border: 1px solid var(--line);
          border-radius: 20px;
          font-size: 12px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--ink-soft);
          background: #fff;
          white-space: nowrap;
        }
        .dt-m-chip.active {
          border-color: var(--accent);
          background: var(--accent);
          color: #fff;
          font-weight: 600;
        }

        /* ---------- Hero ---------- */
        .dt-hero {
          position: relative;
          height: 500px;
          margin-top: -84px;
          background-size: cover;
          background-position: center 35%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dt-hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(20,17,14,0.55) 0%, rgba(20,17,14,0.35) 45%, rgba(20,17,14,0.55) 100%);
        }
        .dt-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #fff;
          max-width: 560px;
          padding: 0 24px;
        }
        .dt-hero-eyebrow {
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          opacity: 0.8;
          margin-bottom: 14px;
        }
        .dt-hero-title {
          font-size: 46px;
          font-weight: 400;
          letter-spacing: 0.01em;
          margin: 0 0 14px;
          font-family: 'Playfair Display', Georgia, serif;
        }
        .dt-hero-sub {
          font-size: 13.5px;
          line-height: 1.7;
          opacity: 0.88;
        }

        /* ---------- Layout ---------- */
        .dt-body {
          display: grid;
          grid-template-columns: 230px 1fr;
          gap: 48px;
          max-width: 1280px;
          margin: 0 auto;
          padding: 56px 56px 80px;
        }

        /* ---------- Sidebar ---------- */
        .dt-side-title {
          font-size: 20px;
          margin: 0 0 18px;
          font-weight: 500;
        }
        .dt-cat-list {
          list-style: none;
          margin: 0 0 40px;
          padding: 0;
          border-bottom: 1px solid var(--line);
        }
        .dt-cat-list li {
          padding: 8px 0;
          font-size: 12.5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-soft);
          cursor: pointer;
          position: relative;
        }
        .dt-cat-list li.active {
          color: var(--accent);
          font-weight: 600;
        }
        .dt-cat-list li.active::after {
          content: "";
          position: absolute;
          right: -1px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--accent);
        }
        .dt-filter-block {
          border-bottom: 1px solid var(--line);
          padding: 20px 0;
        }
        .dt-filter-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-soft);
          margin-bottom: 14px;
        }
        .dt-check-row {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 13px;
          color: var(--ink);
          padding: 5px 0;
        }
        .dt-check-row input { accent-color: var(--accent); width: 14px; height: 14px; }
        .dt-swatch {
          width: 11px; height: 11px; border-radius: 50%; display: inline-block; border: 1px solid #0002;
        }
        .dt-more {
          font-size: 11.5px;
          color: var(--ink-soft);
          margin-top: 6px;
          text-decoration: underline;
        }
        .dt-size-grid {
          display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px;
        }
        .dt-size-chip {
          width: 36px; height: 32px;
          border: 1px solid var(--line);
          display: flex; align-items: center; justify-content: center;
          font-size: 11.5px;
          color: var(--ink-soft);
          background: #fff;
        }
        .dt-size-chip.selected {
          border-color: var(--accent);
          color: var(--ink);
        }
        .dt-price-track {
          height: 3px;
          background: var(--line);
          border-radius: 2px;
          margin: 18px 0 10px;
          position: relative;
        }
        .dt-price-track::after {
          content: "";
          position: absolute; left: 12%; right: 6%; top: 0; bottom: 0;
          background: var(--accent); border-radius: 2px;
        }
        .dt-price-track .knob {
          position: absolute;
          width: 12px; height: 12px; border-radius: 50%;
          background: var(--accent);
          top: 50%; transform: translateY(-50%);
        }
        .dt-price-label { font-size: 12px; color: var(--ink-soft); }
        .dt-view-btn {
          width: 100%;
          background: var(--accent);
          color: #fff;
          border: none;
          padding: 13px;
          font-size: 11.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-top: 26px;
        }
        .dt-reset {
          display: flex; align-items: center; gap: 6px;
          font-size: 11.5px;
          color: var(--ink-soft);
          margin-top: 14px;
          letter-spacing: 0.04em;
        }

        /* ---------- Toolbar ---------- */
        .dt-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .dt-count { font-size: 13.5px; color: var(--ink-soft); }
        .dt-count b { color: var(--ink); font-weight: 600; }
        .dt-toolbar-right { display: flex; align-items: center; gap: 22px; }
        .dt-sort {
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          display: flex; align-items: center; gap: 6px;
          color: var(--ink);
        }
        .dt-view-toggle { display: flex; gap: 10px; color: var(--ink-soft); }
        .dt-view-toggle svg.on { color: var(--ink); }

        /* ---------- Product grid ---------- */
        .dt-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px 24px;
        }
        .dt-card { position: relative; }
        .dt-card-img-wrap {
          position: relative;
          background: var(--bg-muted);
          aspect-ratio: 3/3.7;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .dt-card-img-wrap img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .5s ease;
        }
        .dt-card:hover .dt-card-img-wrap img { transform: scale(1.045); }
        .dt-badge {
          position: absolute; top: 12px; left: 12px;
          background: #fff;
          font-size: 9.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 9px;
          color: var(--ink);
          z-index: 2;
        }
        .dt-badge.dark { background: #1c1a17; color: #fff; }
        .dt-rating-badge {
          position: absolute; bottom: 10px; left: 10px;
          display: flex; align-items: center; gap: 4px;
          background: rgba(28,26,23,0.85);
          color: #fff;
          font-size: 10.5px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 3px;
          z-index: 2;
        }
        .dt-rating-badge .stars { color: var(--accent); }
        .dt-card-actions {
          position: absolute;
          right: 10px;
          top: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          opacity: 0;
          transform: translateX(6px);
          transition: all .25s ease;
        }
        .dt-card:hover .dt-card-actions { opacity: 1; transform: translateX(0); }
        .dt-card-actions button {
          width: 30px; height: 30px;
          border-radius: 50%;
          border: none;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          color: var(--ink);
          box-shadow: 0 2px 6px rgba(0,0,0,.12);
        }
        .dt-quickview {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          background: #1c1a17;
          color: #fff;
          text-align: center;
          padding: 11px;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(8px);
          transition: all .25s ease;
        }
        .dt-card:hover .dt-quickview { opacity: 1; transform: translateY(0); }
        .dt-card-name {
          font-size: 13.5px;
          color: var(--ink);
          margin: 0 0 6px;
          line-height: 1.4;
        }
        .dt-card-price {
          font-size: 13.5px;
          font-weight: 600;
        }
        .dt-card-price .strike {
          text-decoration: line-through;
          color: var(--price-strike);
          font-weight: 400;
          margin-left: 6px;
        }
        .dt-card-price .sale { color: #b3543a; }
        .dt-discount-tag {
          display: inline-block;
          margin-top: 6px;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: #5c7a52;
          background: #eef3ea;
          padding: 3px 8px;
          border-radius: 3px;
        }
        .dt-swatch-row, .dt-thumb-row {
          display: flex; gap: 6px; margin-bottom: 8px;
        }
        .dt-thumb-row img {
          width: 26px; height: 26px; object-fit: cover; border: 1px solid var(--line);
        }
        .dt-color-dot {
          width: 8px; height: 8px; border-radius: 50%; border: 1px solid #0002;
        }
        .dt-stars { display: flex; gap: 2px; margin-bottom: 6px; }
        .dt-mini-sizes { display: flex; gap: 6px; margin-top: 8px; }
        .dt-mini-sizes span {
          font-size: 10.5px;
          border: 1px solid var(--line);
          padding: 3px 7px;
          color: var(--ink-soft);
        }
        .dt-mini-sizes span.sel { border-color: var(--ink); color: var(--ink); }
        .dt-colour-count {
          font-size: 11px; color: var(--ink-soft); margin-bottom: 6px; display:block;
        }

        /* ---------- Pagination ---------- */
        .dt-pagination {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 56px;
        }
        .dt-pagination button {
          min-width: 34px; height: 34px;
          border: 1px solid var(--line);
          background: #fff;
          font-size: 12px;
          color: var(--ink-soft);
          padding: 0 12px;
        }
        .dt-pagination button.active { background: var(--accent); color: #fff; border-color: var(--accent); }

        /* ---------- Recently viewed ---------- */
        .dt-recent {
          background: var(--bg-muted);
          padding: 64px 56px;
        }
        .dt-recent-inner { max-width: 1280px; margin: 0 auto; }
        .dt-recent h2 {
          font-size: 26px;
          font-weight: 500;
          margin: 0 0 28px;
          font-family: 'Playfair Display', Georgia, serif;
        }
        .dt-recent-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 22px;
        }
        .dt-recent-card img {
          width: 100%; aspect-ratio: 1/1.15; object-fit: cover; margin-bottom: 12px;
        }
        .dt-recent-card .name { font-size: 12.5px; margin-bottom: 4px; }
        .dt-recent-card .price { font-size: 12.5px; font-weight: 600; }

        /* ---------- Footer ---------- */
        .dt-footer { padding: 64px 56px 28px; border-top: 1px solid var(--line); }
        .dt-footer-inner {
          max-width: 1280px; margin: 0 auto;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.3fr;
          gap: 32px;
          padding-bottom: 40px;
        }
        .dt-footer h4 {
          font-size: 12px; letter-spacing: 0.12em; margin: 0 0 18px; text-transform: uppercase;
        }
        .dt-footer .brand { font-size: 18px; letter-spacing: 0.18em; margin-bottom: 18px; }
        .dt-footer p { font-size: 13px; color: var(--ink-soft); line-height: 1.8; margin: 0 0 4px; }
        .dt-footer ul { list-style: none; padding: 0; margin: 0; }
        .dt-footer li { font-size: 13px; color: var(--ink-soft); margin-bottom: 11px; }
        .dt-footer .social { display: flex; gap: 12px; margin-top: 18px; }
        .dt-footer .social span {
          width: 30px; height: 30px; border: 1px solid var(--line); border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 12px; color: var(--ink-soft);
        }
        .dt-newsletter-input {
          display: flex; border: 1px solid var(--line); margin: 16px 0;
        }
        .dt-newsletter-input input {
          flex: 1; border: none; padding: 12px 14px; font-size: 13px; outline: none;
        }
        .dt-newsletter-input button {
          background: none; border: none; padding: 0 16px; color: var(--ink-soft);
        }
        .dt-subscribe {
          background: var(--accent); color: #fff; border: none;
          padding: 12px 26px; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
        }
        .dt-footer-bottom {
          max-width: 1280px; margin: 0 auto;
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 24px; border-top: 1px solid var(--line);
          font-size: 12px; color: var(--ink-soft);
        }
        .dt-footer-bottom .langs { display: flex; gap: 14px; }
        .dt-footer-bottom .pay { display: flex; gap: 12px; align-items: center; }

        /* Mobile filter trigger bar: hidden on desktop by default */
        .dt-mobile-filter-bar {
          display: none;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }
        .dt-mobile-filter-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid var(--ink);
          background: #fff;
          padding: 12px;
          font-size: 11.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .dt-mobile-filter-btn.active {
          background: var(--ink);
          color: #fff;
          border-color: var(--ink);
        }
        /* On desktop: accordion head/chevron are inert, body always expanded */
        .dt-accordion-head { cursor: default; }
        .dt-accordion-head svg { display: none; }
        .dt-accordion-body { max-height: none !important; overflow: visible; }

        @media (max-width: 980px) {
          .dt-mobile-filter-bar { display: flex; }
          .dt-body { grid-template-columns: 1fr; padding: 32px 20px 60px; }
          .dt-grid { grid-template-columns: repeat(2, 1fr); }
          .dt-recent-grid { grid-template-columns: repeat(2, 1fr); }
          .dt-footer-inner { grid-template-columns: 1fr 1fr; }
          .dt-header { padding: 18px 20px; }
          .dt-nav { display: none; }
          .dt-hero { height: 280px; }
          .dt-hero-title { font-size: 30px; }
          .dt-hero-content { padding-top: 40px; }

          /* ---- Mobile sidebar collapse ---- */
          aside.dt-sidebar {
            border: 1px solid var(--line);
            padding: 0 16px;
            margin-bottom: 28px;
            display: none;
          }
          aside.dt-sidebar.open { display: block; }

          .dt-side-title { display: none; } /* replaced by accordion headers on mobile */

          .dt-cat-list { margin: 0; border-bottom: none; }
          .dt-accordion-section { border-bottom: 1px solid var(--line); }
          .dt-accordion-section:last-child { border-bottom: none; }
          .dt-accordion-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 0;
            font-size: 13px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            font-weight: 500;
            cursor: pointer;
          }
          .dt-accordion-head svg {
            display: block;
            transition: transform .25s ease;
          }
          .dt-accordion-head.expanded svg { transform: rotate(180deg); }
          .dt-accordion-body {
            max-height: 0 !important;
            overflow: hidden;
            transition: max-height .3s ease, padding .3s ease;
          }
          .dt-accordion-body.expanded {
            max-height: 600px !important;
            padding-bottom: 18px;
          }
          .dt-cat-list li.active::after { display: none; }
          .dt-filter-block { border-bottom: none; padding: 0; }
          .dt-view-btn { margin-top: 6px; margin-bottom: 18px; }

          /* ---- Flipkart-style mobile shop chrome ---- */
          .dt-m-topbar { display: flex; }
          .dt-m-sortfilter { display: flex; }
          .dt-m-chips { display: flex; }
          .dt-hero { display: none; } /* shop-style header replaces the big hero on mobile */

          /* ---- Card adjustments to always show heart / rating / discount ---- */
          .dt-card-actions {
            opacity: 1;
            transform: none;
            top: 8px;
            right: 8px;
            gap: 6px;
          }
          .dt-card-actions button:not(:first-child) { display: none; } /* keep only wishlist on mobile */
          .dt-card-actions button {
            width: 26px; height: 26px;
          }
          .dt-quickview { display: none; }
          .dt-card-name { font-size: 12.5px; }
        }

        @media (min-width: 981px) {
          aside.dt-sidebar { display: block !important; }
          .dt-accordion-head { display: none; }
        }

        @media (max-width: 480px) {
          .dt-header { flex-wrap: wrap; gap: 12px; }
          .dt-logo { font-size: 17px; letter-spacing: 0.14em; }
          .dt-icons { gap: 14px; }
          .dt-hero-eyebrow { font-size: 10px; }
          .dt-hero-title { font-size: 26px; }
          .dt-hero-sub { font-size: 12px; }
          .dt-grid { grid-template-columns: 1fr 1fr; gap: 16px 12px; }
          .dt-recent-grid { grid-template-columns: 1fr 1fr; }
          .dt-toolbar { flex-wrap: wrap; gap: 10px; }
        }
      `}</style>

      {/* MOBILE TOP BAR (Flipkart-style) — hidden on desktop */}
      <div className="dt-m-topbar">
        <div className="dt-m-topbar-left">
          <button aria-label="Back"><ArrowLeft size={20} /></button>
          <span className="dt-m-topbar-title">{activeCategory || heroTitle}</span>
        </div>
        <div className="dt-m-topbar-icons">
          <button aria-label="Search"><Search size={19} /></button>
          <button aria-label="Wishlist"><Heart size={19} /></button>
          <button aria-label="Bag">
            <ShoppingBag size={19} />
            <span className="dot" />
          </button>
        </div>
      </div>

      {/* MOBILE SORT / FILTER ROW */}
      <div className="dt-m-sortfilter">
        <button>
          <ArrowUpDown size={14} /> Sort
        </button>
        <button
          className={mobileFiltersOpen ? "active" : ""}
          onClick={() => setMobileFiltersOpen((v) => !v)}
        >
          <SlidersHorizontal size={14} /> Filter
        </button>
      </div>

      {/* MOBILE CATEGORY CHIPS */}
      {categories.length > 0 && (
        <div className="dt-m-chips">
          {categories.map((c) => (
            <div
              key={c.label}
              className={`dt-m-chip ${c.label === activeCategory ? "active" : ""}`}
              onClick={() => setActiveCategory(c.label)}
            >
              {c.label}
            </div>
          ))}
        </div>
      )}

      {/* HEADER + HERO (desktop) */}
      <Navbar/>
      <div
        className="dt-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        

        <div className="dt-hero-content">
          {heroEyebrow && <div className="dt-hero-eyebrow">{heroEyebrow}</div>}
          <h1 className="dt-hero-title">{heroTitle}</h1>
          <p className="dt-hero-sub">{heroSubtitle}</p>
        </div>
      </div>

      {/* BODY */}
      <div className="dt-body">
        {/* MOBILE FILTER TRIGGER (shown only on small screens) */}
        <div className="dt-mobile-filter-bar">
          <button
            className={`dt-mobile-filter-btn ${mobileFiltersOpen ? "active" : ""}`}
            onClick={() => setMobileFiltersOpen((v) => !v)}
          >
            {mobileFiltersOpen ? "Close" : "Categories & Filter"} <ChevronDown size={13} />
          </button>
        </div>

        {/* SIDEBAR */}
        <aside className={`dt-sidebar ${mobileFiltersOpen ? "open" : ""}`}>
          {/* Categories accordion */}
          <h3 className="dt-side-title">Categories</h3>
          <div className="dt-accordion-section">
            <div
              className={`dt-accordion-head ${openSections.categories ? "expanded" : ""}`}
              onClick={() => toggleSection("categories")}
            >
              Categories <ChevronDown size={14} />
            </div>
            <div className={`dt-accordion-body ${openSections.categories ? "expanded" : ""}`}>
              <ul className="dt-cat-list">
                {categories.map((c) => (
                  <li
                    key={c.label}
                    className={c.label === activeCategory ? "active" : ""}
                    onClick={() => setActiveCategory(c.label)}
                  >
                    {c.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className="dt-side-title">Filter</h3>

          {materials.length > 0 && (
            <div className="dt-accordion-section">
              <div
                className={`dt-accordion-head ${openSections.materials ? "expanded" : ""}`}
                onClick={() => toggleSection("materials")}
              >
                Materials <ChevronDown size={14} />
              </div>
              <div className={`dt-accordion-body ${openSections.materials ? "expanded" : ""}`}>
                <div className="dt-filter-block">
                  {materials.map((m) => (
                    <label className="dt-check-row" key={m.label}>
                      <input
                        type="checkbox"
                        checked={checkedMaterials.includes(m.label)}
                        onChange={() => toggle(m.label, checkedMaterials, setCheckedMaterials)}
                      />
                      {m.label}
                    </label>
                  ))}
                  <div className="dt-more">More ⌄</div>
                </div>
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="dt-accordion-section">
              <div
                className={`dt-accordion-head ${openSections.colors ? "expanded" : ""}`}
                onClick={() => toggleSection("colors")}
              >
                Colors <ChevronDown size={14} />
              </div>
              <div className={`dt-accordion-body ${openSections.colors ? "expanded" : ""}`}>
                <div className="dt-filter-block">
                  {colors.map((c) => (
                    <label className="dt-check-row" key={c.label}>
                      <span className="dt-swatch" style={{ background: c.hex }} />
                      {c.label}
                    </label>
                  ))}
                  <div className="dt-more">More ⌄</div>
                </div>
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="dt-accordion-section">
              <div
                className={`dt-accordion-head ${openSections.size ? "expanded" : ""}`}
                onClick={() => toggleSection("size")}
              >
                Size <ChevronDown size={14} />
              </div>
              <div className={`dt-accordion-body ${openSections.size ? "expanded" : ""}`}>
                <div className="dt-filter-block">
                  <div className="dt-size-grid">
                    {sizes.map((s) => (
                      <div
                        key={s}
                        className={`dt-size-chip ${selectedSizes.includes(s) ? "selected" : ""}`}
                        onClick={() => toggle(s, selectedSizes, setSelectedSizes)}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="dt-accordion-section">
            <div
              className={`dt-accordion-head ${openSections.price ? "expanded" : ""}`}
              onClick={() => toggleSection("price")}
            >
              Price <ChevronDown size={14} />
            </div>
            <div className={`dt-accordion-body ${openSections.price ? "expanded" : ""}`}>
              <div className="dt-filter-block" style={{ borderBottom: "none" }}>
                <div className="dt-price-track">
                  <span className="knob" style={{ left: "12%" }} />
                  <span className="knob" style={{ left: "94%" }} />
                </div>
                <div className="dt-price-label">
                  From: ${priceRange.min}.00 - ${priceRange.max}.00
                </div>
              </div>
            </div>
          </div>

          <button className="dt-view-btn">View Result ({products.length})</button>
          <div className="dt-reset">↺ Reset All</div>
        </aside>

        {/* MAIN */}
        <main>
          <div className="dt-toolbar">
            <div className="dt-count">
              <b>{products.length}</b> Products founded
            </div>
            <div className="dt-toolbar-right">
              <div className="dt-sort">Sort by featured <ChevronDown size={13} /></div>
              <div className="dt-view-toggle">
                <List size={16} className={view === "list" ? "on" : ""} onClick={() => setView("list")} style={{ cursor: "pointer" }} />
                <Grid3x3 size={16} className={view === "grid" ? "on" : ""} onClick={() => setView("grid")} style={{ cursor: "pointer" }} />
              </div>
            </div>
          </div>

          <div className="dt-grid">
            {products.map((p, i) => (
              <div className="dt-card" key={i}>
                <div className="dt-card-img-wrap">
                  {p.badge && <span className={`dt-badge ${p.badgeDark ? "dark" : ""}`}>{p.badge}</span>}
                  <img src={p.image} alt={p.name} loading="lazy" />
                  {p.rating && (
                    <div className="dt-rating-badge">
                      {p.rating.toFixed ? p.rating.toFixed(1) : p.rating} <span className="stars">★</span>
                    </div>
                  )}
                  <div className="dt-card-actions">
                    <button><Heart size={13} /></button>
                    <button><Maximize2 size={13} /></button>
                    <button><Repeat size={13} /></button>
                  </div>
                  <div className="dt-quickview">Quick View</div>
                </div>

                {p.thumbs && (
                  <div className="dt-thumb-row">
                    {p.thumbs.map((t, ti) => <img key={ti} src={t} alt="" />)}
                  </div>
                )}
                {p.colorDots && (
                  <div className="dt-swatch-row">
                    {p.colorDots.map((c, ci) => <span key={ci} className="dt-color-dot" style={{ background: c }} />)}
                  </div>
                )}
                {p.colourCount && <span className="dt-colour-count">{p.colourCount} colours</span>}

                <p className="dt-card-name">{p.name}</p>
                <div className="dt-card-price">
                  {p.salePrice ? (
                    <>
                      <span className="sale">${p.salePrice}</span>
                      <span className="strike">${p.price}</span>
                    </>
                  ) : (
                    <span>${p.price}</span>
                  )}
                </div>
                {discountPct(p) && (
                  <span className="dt-discount-tag">↓ {discountPct(p)}% off</span>
                )}

                {p.miniSizes && (
                  <div className="dt-mini-sizes">
                    {p.miniSizes.map((s, mi) => <span key={mi} className={s.sel ? "sel" : ""}>{s.label}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="dt-pagination">
            {[1, 2, 3, 4].map((n) => (
              <button key={n} className={n === page ? "active" : ""} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))}>Next ›</button>
          </div>
        </main>
      </div>

      {/* RECENTLY VIEWED */}
      {recentlyViewed.length > 0 && (
        <section className="dt-recent">
          <div className="dt-recent-inner">
            <h2>Recently Viewed</h2>
            <div className="dt-recent-grid">
              {recentlyViewed.map((r, i) => (
                <div className="dt-recent-card" key={i}>
                  <img src={r.image} alt={r.name} loading="lazy" />
                  <p className="name">{r.name}</p>
                  <div className="price">
                    {r.salePrice ? (
                      <>
                        <span style={{ color: "#b3543a" }}>${r.salePrice}</span>
                        <span className="strike" style={{ marginLeft: 6 }}>${r.price}</span>
                      </>
                    ) : (
                      <span>${r.price}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <Footer/>
    </div>
  );
}