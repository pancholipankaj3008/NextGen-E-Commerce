import { BarChart3, Boxes, Edit, LayoutGrid, LogOut, Mail, Package, Percent, Plus, Search, Shield, Star, Trash2, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logout } from "../features/auth/authThunk";
import {
  blockAdminUser,
  createCoupon,
  createAdminUser,
  createProduct,
  deleteAdminUser,
  deleteCoupon,
  deleteProduct,
  fetchAdminUsers,
  fetchCoupons,
  fetchDashboard,
  fetchAdminOrders,
  unblockAdminUser,
  updateAdminUser,
  updateAdminOrderStatus,
  updateCoupon,
  updateProduct,
} from "../features/admin/adminThunk";

import {
  GetAllSubscribers,
  DeleteSubscriber,
} from "../features/newsletter/newsletterThunk";

import {
  GetAllProducts as fetchAllProducts,
} from "../features/product/productThunk";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

// AdminDashboard.jsx ke top pe ye import rakho
import AdminProductForm, {
  createEmptyProduct,
  productToForm,
  buildProductForm,
} from "../components/admin/AdminProductForm";   // ← Updated path

const roleTabs = {
  admin: ["dashboard", "products", "users", "coupons", "newsletter", "analytics", "orders"],
  "product manager": ["dashboard", "products"],
  "inventory staff": ["dashboard", "products", "analytics"],
  "order manager": ["dashboard", "orders"],
};

const emptyCoupon = { code: "", discountType: "percent", discountValue: "", minOrderAmount: 0, expireAt: "", active: true };
const emptyUserForm = { name: "", email: "", password: "", role: "user", phone: "" };
const staffRoles = ["admin", "product manager", "order manager", "inventory staff"];
const EMPTY_ARRAY = [];
const EMPTY_ADMIN_STATE = {
  dashboard: null,
  userAnalytics: null,
  productAnalytics: null,
  users: EMPTY_ARRAY,
  coupons: EMPTY_ARRAY,
  orders: EMPTY_ARRAY,
  loading: false,
  error: null,
};

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));

const tabMetaAll = [
  ["dashboard", "Dashboard", LayoutGrid],
  ["products", "Products", Boxes],
  ["users", "Customers", Users],
  ["coupons", "Coupons", Percent],
  ["newsletter", "Newsletter", Mail],
  ["analytics", "Analytics", BarChart3],
  ["orders", "Orders", Package],
];

function statusFor(item) {
  if (item.isActive === false) return { label: "Deleted", tone: "rose" };
  if ((item.totalStock || 0) <= 0) return { label: "Out of Stock", tone: "rose" };
  if (item.isFeatured) return { label: "Featured", tone: "gold" };
  return { label: "Active", tone: "olive" };
}

function Pill({ tone = "olive", children }) {
  return <span className={`ng-pill ng-pill-${tone}`}>{children}</span>;
}

function MetricCard({ label, value, Icon }) {
  return (
    <div className="ng-metric">
      <div className="ng-metric-icon"><Icon size={18} /></div>
      <div>
        <h2 className="ng-metric-value">{value ?? 0}</h2>
        <span className="ng-metric-label">{label}</span>
      </div>
    </div>
  );
}

function Avatar({ name }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return <div className="ng-avatar">{initial}</div>;
}

function Donut({ segments, size = 132, stroke = 16, centerLabel, centerValue }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + (s.value || 0), 0) || 1;
  let offset = 0;
  return (
    <div className="ng-donut-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--ng-line)" strokeWidth={stroke} />
        {segments.map((seg, idx) => {
          const fraction = (seg.value || 0) / total;
          const dash = fraction * circumference;
          const circle = (
            <circle
              key={idx}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap={segments.length > 1 ? "butt" : "round"}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
          offset += dash;
          return circle;
        })}
        <text x="50%" y="46%" textAnchor="middle" className="ng-donut-value" fill="var(--ng-ink)">{centerValue}</text>
        <text x="50%" y="62%" textAnchor="middle" className="ng-donut-label" fill="var(--ng-muted)">{centerLabel}</text>
      </svg>
      <div className="ng-legend">
        {segments.map((seg, idx) => (
          <div className="ng-legend-row" key={idx}>
            <span className="ng-legend-dot" style={{ background: seg.color }} />
            <span>{seg.label}</span>
            <strong>{seg.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarRow({ label, value, max, color = "var(--ng-olive)" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="ng-bar-row">
      <div className="ng-bar-row-top"><span>{label}</span><strong>{value}</strong></div>
      <div className="ng-bar-track"><div className="ng-bar-fill" style={{ width: `${pct}%`, background: color }} /></div>
    </div>
  );
}

export function AdminDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [productForm, setProductForm] = useState(createEmptyProduct());
  const [variantFiles, setVariantFiles] = useState({}); // For dynamic multi-variant image uploads
  const [couponForm, setCouponForm] = useState(emptyCoupon);
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [editingUserId, setEditingUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const adminState = useAppSelector((state) => state.admin);
  const productState = useAppSelector((state) => state.product);
  const newsletterState = useAppSelector((state) => state.newsletter);
  const authUser = useAppSelector((state) => state.auth?.user);

  const admin = {
    ...EMPTY_ADMIN_STATE,
    ...(adminState || {}),
    users: Array.isArray(adminState?.users) ? adminState.users : EMPTY_ARRAY,
    coupons: Array.isArray(adminState?.coupons) ? adminState.coupons : EMPTY_ARRAY,
    orders: Array.isArray(adminState?.orders) ? adminState.orders : EMPTY_ARRAY,
  };

  const products = Array.isArray(productState?.items)
    ? productState.items
    : Array.isArray(productState?.products)
      ? productState.products
      : EMPTY_ARRAY;

  const subscribers = Array.isArray(newsletterState?.subscribers)
    ? newsletterState.subscribers
    : EMPTY_ARRAY;

  const role = authUser?.role || "user";
  const tabs = roleTabs[role] || [];
  const canManageProducts = role === "admin" || role === "product manager";
  const tabMeta = tabMetaAll.filter(([key]) => tabs.includes(key));

  useEffect(() => {
    dispatch(fetchDashboard());
    if (tabs.includes("users")) dispatch(fetchAdminUsers());
    if (tabs.includes("coupons")) dispatch(fetchCoupons());
    if (tabs.includes("products")) dispatch(fetchAllProducts({ limit: 50 }));
    if (tabs.includes("newsletter")) dispatch(GetAllSubscribers());
    if (tabs.includes("orders")) dispatch(fetchAdminOrders());
  }, [dispatch, role, tabs]);

  useEffect(() => {
    if (!tabs.includes(tab)) setTab(tabs[0] || "dashboard");
  }, [tab, tabs]);

  useEffect(() => { setPage(1); }, [tab, search]);

  const dashboardCards = useMemo(() => [
    ["Total Users", admin.userAnalytics?.totalUsers || admin.users.length, Users],
    ["Admins", admin.userAnalytics?.totalAdmins || 0, Shield],
    ["Blocked Users", admin.userAnalytics?.blockedUsers || 0, Users],
    ["Products", admin.productAnalytics?.totalProducts || products.length, Boxes],
    ["Featured", admin.productAnalytics?.featuredProducts || 0, Star],
    ["Out Of Stock", admin.productAnalytics?.outOfStockProducts || 0, Package],
  ], [admin.productAnalytics, admin.userAnalytics, admin.users.length, products.length]);

  const categoryBreakdown = useMemo(() => {
    const counts = {};
    products.forEach((item) => { const key = item.category || "Other"; counts[key] = (counts[key] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [products]);

  const maxCategoryCount = Math.max(1, ...categoryBreakdown.map(([, count]) => count));

  const totalUsersCount = admin.userAnalytics?.totalUsers || admin.users.length || 0;
  const blockedUsersCount = admin.userAnalytics?.blockedUsers || 0;
  const userDonutSegments = [
    { label: "Active", value: Math.max(0, totalUsersCount - blockedUsersCount), color: "var(--ng-olive)" },
    { label: "Blocked", value: blockedUsersCount, color: "var(--ng-rose)" },
  ];

  const totalProductsCount = admin.productAnalytics?.totalProducts || products.length || 0;
  const featuredCount = admin.productAnalytics?.featuredProducts || 0;
  const outOfStockCount = admin.productAnalytics?.outOfStockProducts || 0;
  const regularCount = Math.max(0, totalProductsCount - featuredCount - outOfStockCount);
  const productDonutSegments = [
    { label: "Featured", value: featuredCount, color: "var(--ng-gold)" },
    { label: "Regular", value: regularCount, color: "var(--ng-olive)" },
    { label: "Out of Stock", value: outOfStockCount, color: "var(--ng-rose)" },
  ];

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((item) => (item.name || item.title || "").toLowerCase().includes(q) || (item.category || "").toLowerCase().includes(q));
  }, [products, search]);

  const pagedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  const customerUsers = useMemo(() => admin.users.filter((user) => !staffRoles.includes(user.role)), [admin.users]);
  const staffUsers = useMemo(() => admin.users.filter((user) => staffRoles.includes(user.role)), [admin.users]);

  const submitProduct = (event) => {
    event.preventDefault();
    const formData = buildProductForm(productForm, variantFiles);
    const action = editingId 
      ? updateProduct({ id: editingId, formData }) 
      : createProduct(formData);
    
    dispatch(action).then(() => {
      dispatch(fetchAllProducts({ limit: 50 }));
      setEditingId(null);
      setProductForm(createEmptyProduct());
      setVariantFiles({});
      setShowProductForm(false);
    });
  };

  const startEditProduct = (product) => {
    setEditingId(product._id);
    setProductForm(productToForm(product));
    setVariantFiles({}); // Clear previous files
    setShowProductForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeProductForm = () => {
    setEditingId(null);
    setProductForm(createEmptyProduct());
    setVariantFiles({});
    setShowProductForm(false);
  };

  const handleLogout = () => {
    dispatch(Logout()).then(() => navigate("/auth", { replace: true }));
  };

  const renderUserRows = (users, emptyLabel) => (
    <tbody>
      {users.map((user) => {
        const protectedAdmin = user.role === "admin";
        return (
          <tr key={user._id}>
            <td><div className="ng-row-title"><Avatar name={user.name} /> {user.name}</div></td>
            <td>{user.email}</td>
            <td style={{ textTransform: "capitalize" }}>{user.role}</td>
            <td><Pill tone={user.isBlocked ? "rose" : "olive"}>{user.isBlocked ? "Blocked" : "Active"}</Pill></td>
            <td>
              <div className="ng-actions">
                <button className="ng-btn" onClick={() => { 
                  setEditingUserId(user._id); 
                  setUserForm({ name: user.name || "", email: user.email || "", phone: user.phone || "", role: user.role || "user", password: "" }); 
                }}>
                  <Edit size={13} /> Edit
                </button>
                {protectedAdmin ? <Pill tone="gold">Protected</Pill> : 
                  <button className="ng-btn" onClick={() => dispatch(user.isBlocked ? unblockAdminUser(user._id) : blockAdminUser(user._id)).then(() => dispatch(fetchAdminUsers()))}>
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>}
                {!protectedAdmin && <button className="ng-btn ng-btn-danger" onClick={() => dispatch(deleteAdminUser(user._id))}><Trash2 size={13} /></button>}
              </div>
            </td>
          </tr>
        );
      })}
      {users.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--ng-muted)", padding: 30 }}>{emptyLabel}</td></tr>}
    </tbody>
  );

  return (
    <div className="ng-shell">
      <style>{`
        .ng-shell{ --ng-cream:#F8F4EC; --ng-cream-soft:#FBF8F2; --ng-ink:#23211D; --ng-olive:#5C6B4D; --ng-olive-soft:#E7ECDF; --ng-gold:#B8946B; --ng-gold-soft:#F3E6D6; --ng-rose:#B8554A; --ng-rose-soft:#F4E1DD; --ng-line:#E7E0D2; --ng-muted:#857F70;
          font-family:"DM Sans", -apple-system, sans-serif; background:var(--ng-cream); color:var(--ng-ink); min-height:100vh; display:flex; }
        .ng-shell h1, .ng-shell h2, .ng-shell .ng-display{ font-family:"Cormorant Garamond", serif; font-weight:600; letter-spacing:0.01em; }
        .ng-sidebar{ width:248px; flex-shrink:0; background:var(--ng-cream-soft); border-right:1px solid var(--ng-line); padding:28px 18px; display:flex; flex-direction:column; gap:6px; position:sticky; top:0; height:100vh; }
        .ng-logo{ font-family:"Cormorant Garamond", serif; font-size:26px; font-weight:600; padding:6px 10px 26px; letter-spacing:0.03em; }
        .ng-logo span{ color:var(--ng-olive); }
        .ng-nav-item{ display:flex; align-items:center; gap:12px; padding:11px 14px; border-radius:10px; font-size:14px; color:var(--ng-muted); cursor:pointer; border:none; background:none; text-align:left; text-transform:capitalize; transition:background .15s, color .15s; }
        .ng-nav-item:hover{ background:var(--ng-olive-soft); color:var(--ng-ink); }
        .ng-nav-item.active{ background:var(--ng-ink); color:var(--ng-cream-soft); }
        .ng-sidebar-foot{ margin-top:auto; font-size:12px; color:var(--ng-muted); padding:10px; border-top:1px solid var(--ng-line); }
        .ng-main{ flex:1; min-width:0; padding:26px 36px 60px; }
        .ng-topbar{ display:flex; align-items:center; justify-content:space-between; gap:20px; margin-bottom:26px; }
        .ng-topbar-actions{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; justify-content:flex-end; }
        .ng-search{ flex:1; max-width:420px; display:flex; align-items:center; gap:10px; background:#fff; border:1px solid var(--ng-line); border-radius:12px; padding:10px 16px; color:var(--ng-muted); }
        .ng-search input{ border:none; outline:none; background:none; font-size:14px; width:100%; font-family:"DM Sans", sans-serif; color:var(--ng-ink); }
        .ng-role-chip{ font-size:12px; text-transform:uppercase; letter-spacing:0.08em; color:var(--ng-olive); background:var(--ng-olive-soft); padding:6px 12px; border-radius:999px; }
        .ng-mobile-tabs{ display:none; gap:8px; overflow-x:auto; padding-bottom:8px; margin-bottom:18px; }
        .ng-heading{ display:flex; align-items:baseline; justify-content:space-between; gap:16px; margin-bottom:22px; }
        .ng-heading h1{ font-size:32px; text-transform:capitalize; margin:0; }
        .ng-heading p{ margin:2px 0 0; color:var(--ng-muted); font-size:13px; }
        .ng-grid-3{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .ng-hero{ background:linear-gradient(135deg, var(--ng-ink) 0%, #3A4631 100%); color:var(--ng-cream-soft); border-radius:20px; padding:30px 32px; display:flex; align-items:center; justify-content:space-between; gap:24px; margin-bottom:22px; flex-wrap:wrap; }
        .ng-hero-title{ font-size:30px; margin:6px 0 8px; color:#fff; }
        .ng-hero-sub{ font-size:13.5px; color:rgba(248,244,236,0.72); max-width:420px; margin:0; line-height:1.5; }
        .ng-hero-stats{ display:flex; gap:28px; }
        .ng-hero-stats div{ display:flex; flex-direction:column; align-items:center; }
        .ng-hero-stats strong{ font-family:"Cormorant Garamond", serif; font-size:30px; line-height:1; }
        .ng-hero-stats span{ font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:rgba(248,244,236,0.65); margin-top:4px; }
        .ng-split-2{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-bottom:22px; }
        .ng-donut-wrap{ display:flex; align-items:center; gap:18px; margin-top:14px; flex-wrap:wrap; }
        .ng-donut-value{ font-size:20px; font-family:"Cormorant Garamond", serif; font-weight:700; }
        .ng-donut-label{ font-size:9px; text-transform:uppercase; letter-spacing:0.05em; }
        .ng-legend{ display:flex; flex-direction:column; gap:8px; flex:1; min-width:110px; }
        .ng-legend-row{ display:flex; align-items:center; gap:8px; font-size:12.5px; color:var(--ng-muted); }
        .ng-legend-row strong{ margin-left:auto; color:var(--ng-ink); }
        .ng-legend-dot{ width:9px; height:9px; border-radius:50%; flex-shrink:0; }
        .ng-bar-row{ margin-bottom:13px; }
        .ng-bar-row:last-child{ margin-bottom:0; }
        .ng-bar-row-top{ display:flex; justify-content:space-between; font-size:12.5px; color:var(--ng-ink); margin-bottom:5px; }
        .ng-bar-row-top span{ color:var(--ng-muted); text-transform:capitalize; }
        .ng-bar-track{ height:7px; border-radius:99px; background:var(--ng-cream-soft); overflow:hidden; }
        .ng-bar-fill{ height:100%; border-radius:99px; transition:width .3s ease; }
        @media (max-width: 1100px){ .ng-split-2{ grid-template-columns:1fr; } }
        .ng-metric{ background:#fff; border:1px solid var(--ng-line); border-radius:16px; padding:20px; display:flex; align-items:center; gap:14px; }
        .ng-metric-icon{ width:38px; height:38px; border-radius:10px; background:var(--ng-olive-soft); color:var(--ng-olive); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .ng-metric-value{ font-size:28px; margin:0; line-height:1; }
        .ng-metric-label{ font-size:12px; color:var(--ng-muted); text-transform:uppercase; letter-spacing:0.05em; }
        .ng-panel{ background:#fff; border:1px solid var(--ng-line); border-radius:18px; padding:24px; margin-bottom:22px; }
        .ng-panel-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
        .ng-eyebrow{ font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:var(--ng-olive); font-weight:600; }
        .ng-table-card{ background:#fff; border:1px solid var(--ng-line); border-radius:18px; overflow:hidden; }
        .ng-table{ width:100%; border-collapse:collapse; font-size:13.5px; }
        .ng-table thead th{ text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:var(--ng-muted); font-weight:600; padding:16px 20px; border-bottom:1px solid var(--ng-line); background:var(--ng-cream-soft); }
        .ng-table tbody td{ padding:14px 20px; border-bottom:1px solid var(--ng-line); vertical-align:middle; }
        .ng-table tbody tr:last-child td{ border-bottom:none; }
        .ng-table tbody tr:hover{ background:var(--ng-cream-soft); }
        .ng-row-title{ display:flex; align-items:center; gap:12px; font-weight:600; }
        .ng-product-thumb{ width:48px; height:58px; border-radius:10px; object-fit:cover; background:var(--ng-cream-soft); border:1px solid var(--ng-line); flex-shrink:0; }
        .ng-product-thumb-empty{ width:48px; height:58px; border-radius:10px; background:var(--ng-olive-soft); color:var(--ng-olive); display:flex; align-items:center; justify-content:center; border:1px solid var(--ng-line); flex-shrink:0; }
        .ng-section-title{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:16px 20px; border-bottom:1px solid var(--ng-line); background:var(--ng-cream-soft); }
        .ng-section-title h2{ font-size:22px; margin:0; }
        .ng-avatar{ width:34px; height:34px; border-radius:9px; background:var(--ng-gold-soft); color:var(--ng-gold); display:flex; align-items:center; justify-content:center; font-family:"Cormorant Garamond", serif; font-weight:600; font-size:16px; flex-shrink:0; }
        .ng-pill{ display:inline-block; font-size:11px; padding:5px 11px; border-radius:999px; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; }
        .ng-pill-olive{ background:var(--ng-olive-soft); color:var(--ng-olive); }
        .ng-pill-rose{ background:var(--ng-rose-soft); color:var(--ng-rose); }
        .ng-pill-gold{ background:var(--ng-gold-soft); color:var(--ng-gold); }
        .ng-actions{ display:flex; gap:8px; }
        .ng-btn{ display:inline-flex; align-items:center; gap:6px; font-size:12.5px; padding:8px 13px; border-radius:9px; border:1px solid var(--ng-line); background:#fff; color:var(--ng-ink); cursor:pointer; font-family:"DM Sans", sans-serif; transition:background .15s; }
        .ng-btn:hover{ background:var(--ng-cream-soft); }
        .ng-btn-primary{ background:var(--ng-ink); color:#fff; border-color:var(--ng-ink); }
        .ng-btn-primary:hover{ background:#000; }
        .ng-btn-danger{ color:var(--ng-rose); border-color:var(--ng-rose-soft); }
        .ng-btn-danger:hover{ background:var(--ng-rose-soft); }
        .ng-btn-block{ width:100%; justify-content:center; }
        .ng-foot{ display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-top:1px solid var(--ng-line); font-size:13px; color:var(--ng-muted); }
        .ng-page-btns{ display:flex; align-items:center; gap:6px; }
        .ng-page-num{ width:30px; height:30px; border-radius:8px; border:1px solid var(--ng-line); background:#fff; display:flex; align-items:center; justify-content:center; font-size:12.5px; cursor:pointer; color:var(--ng-muted); }
        .ng-page-num.active{ background:var(--ng-ink); color:#fff; border-color:var(--ng-ink); }
        .ng-field{ display:flex; flex-direction:column; gap:6px; font-size:12.5px; color:var(--ng-muted); margin-bottom:14px; }
        .ng-field label{ text-transform:uppercase; letter-spacing:0.05em; font-size:11px; }
        .ng-input, .ng-select, .ng-textarea{ font-family:"DM Sans", sans-serif; border:1px solid var(--ng-line); border-radius:9px; padding:10px 12px; font-size:13.5px; color:var(--ng-ink); background:var(--ng-cream-soft); outline:none; }
        .ng-input:focus, .ng-select:focus, .ng-textarea:focus{ border-color:var(--ng-olive); }
        .ng-grid-form-3{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        .ng-grid-form-2{ display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }
        .ng-grid-form-4{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        .ng-variant-card{ border:1px solid var(--ng-line); border-radius:12px; padding:14px; background:var(--ng-cream-soft); margin-bottom:12px; }
        .ng-check{ display:flex; align-items:center; gap:8px; font-size:12.5px; background:var(--ng-cream-soft); border:1px solid var(--ng-line); border-radius:999px; padding:8px 14px; cursor:pointer; }
        @media (max-width: 900px){ .ng-sidebar{ display:none; } .ng-mobile-tabs{ display:flex; } .ng-main{ padding:20px; } .ng-grid-3, .ng-grid-form-3, .ng-grid-form-4{ grid-template-columns:1fr 1fr; } }
        @media (max-width: 640px){ .ng-topbar{ align-items:stretch; flex-direction:column; } .ng-search{ max-width:none; } .ng-topbar-actions{ justify-content:space-between; } .ng-grid-3, .ng-grid-form-2, .ng-grid-form-3, .ng-grid-form-4{ grid-template-columns:1fr; } .ng-table-card{ overflow-x:auto; } }
      `}</style>


      <aside className="ng-sidebar">
        <div className="ng-logo">Next<span>Gen</span></div>
        {tabMeta.map(([key, label, Icon]) => (
          <button key={key} className={`ng-nav-item ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>
            <Icon size={16} /> {label}
          </button>
        ))}
        <div className="ng-sidebar-foot">
          Signed in as<br /><strong style={{ color: "var(--ng-ink)" }}>{authUser?.name || "Admin"}</strong>
          <button className="ng-btn ng-btn-danger ng-btn-block" type="button" onClick={handleLogout} style={{ marginTop: 12 }}><LogOut size={14} /> Logout</button>
        </div>
      </aside>

      <main className="ng-main">
        <div className="ng-topbar">
          <div className="ng-search"><Search size={15} /><input placeholder="Search products, customers..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="ng-topbar-actions">
            <span className="ng-role-chip">{role}</span>
            <button className="ng-btn ng-btn-danger" type="button" onClick={handleLogout}><LogOut size={14} /> Logout</button>
          </div>
        </div>

        {tab === "dashboard" && ((
          <>
            <div className="ng-hero">
              <div>
                <span className="ng-eyebrow" style={{ color: "rgba(248,244,236,0.7)" }}>Overview</span>
                <h2 className="ng-hero-title">Welcome back, {authUser?.name?.split(" ")[0] || "Admin"}</h2>
                <p className="ng-hero-sub">Yahan se NextGen store ka pura health snapshot ek nazar mein milta hai — products, customers aur stock sab.</p>
              </div>
              <div className="ng-hero-stats">
                <div><strong>{totalProductsCount}</strong><span>Products</span></div>
                <div><strong>{totalUsersCount}</strong><span>Customers</span></div>
                <div><strong>{outOfStockCount}</strong><span>Out of Stock</span></div>
              </div>
            </div>

            <div className="ng-grid-3">{dashboardCards.map(([label, value, Icon]) => <MetricCard key={label} label={label} value={value} Icon={Icon} />)}</div>

            <div className="ng-split-2">
              <div className="ng-panel">
                <span className="ng-eyebrow">Customer Health</span>
                <Donut segments={userDonutSegments} centerValue={totalUsersCount} centerLabel="Total" />
              </div>
              <div className="ng-panel">
                <span className="ng-eyebrow">Catalog Mix</span>
                <Donut segments={productDonutSegments} centerValue={totalProductsCount} centerLabel="Products" />
              </div>
              <div className="ng-panel">
                <span className="ng-eyebrow">Top Categories</span>
                <div style={{ marginTop: 14 }}>
                  {categoryBreakdown.length === 0 && <p style={{ color: "var(--ng-muted)", fontSize: 13 }}>No products yet.</p>}
                  {categoryBreakdown.map(([cat, count]) => <BarRow key={cat} label={cat} value={count} max={maxCategoryCount} />)}
                </div>
              </div>
            </div>
          </>
        ))}

        {tab === "products" && (
          <>
            <div className="ng-panel-head">
              <span className="ng-eyebrow">Catalog Products</span>
              {canManageProducts && !showProductForm && (
                <button className="ng-btn ng-btn-primary" type="button" onClick={() => setShowProductForm(true)}>
                  <Plus size={16} /> Add Product
                </button>
              )}
            </div>

            {/* === FULLY DYNAMIC PRODUCT FORM === */}
            {canManageProducts && showProductForm && (
              <AdminProductForm
                productForm={productForm}
                setProductForm={setProductForm}
                variantFiles={variantFiles}
                setVariantFiles={setVariantFiles}
                editingId={editingId}
                loading={false} // You can connect real loading state if needed
                onSubmit={submitProduct}
                onClose={closeProductForm}
              />
            )}

            {/* Products Table (unchanged) */}
            <div className="ng-table-card">
                          <table className="ng-table">
                            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Action</th></tr></thead>
                            <tbody>
                              {pagedProducts.map((item) => {
                                const status = statusFor(item);
                                const imageSrc = typeof item.image === "string" ? item.image : item.image?.url || item.images?.[0]?.url || item.images?.[0] || "";
                                return (
                                  <tr key={item._id}>
                                    <td>
                                      <div className="ng-row-title">
                                        {imageSrc ? <img className="ng-product-thumb" src={imageSrc} alt={item.name || item.title || "Product"} /> : <div className="ng-product-thumb-empty"><Package size={18} /></div>}
                                        {item.name || item.title}
                                      </div>
                                    </td>
                                    <td>{item.category || "-"}</td>
                                    <td>₹{item.finalPrice || item.price}</td>
                                    <td>{item.totalStock || 0} pcs</td>
                                    <td><Pill tone={status.tone}>{status.label}</Pill></td>
                                    <td>
                                      <div className="ng-actions">
                                        {canManageProducts && <button className="ng-btn" onClick={() => startEditProduct(item)}><Edit size={13} /> Edit</button>}
                                        {canManageProducts && <button className="ng-btn ng-btn-danger" onClick={() => dispatch(deleteProduct(item._id)).then(() => dispatch(fetchAllProducts({ limit: 50 })))}><Trash2 size={13} /></button>}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                              {pagedProducts.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--ng-muted)", padding: 30 }}>No products found.</td></tr>}
                            </tbody>
                          </table>
                          <div className="ng-foot">
                            <span>Showing {pagedProducts.length} of {filteredProducts.length}</span>
                            <div className="ng-page-btns">
                              <button className="ng-page-num" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>‹</button>
                              {Array.from({ length: totalPages }).slice(0, 5).map((_, idx) => (
                                <button key={idx} className={`ng-page-num ${page === idx + 1 ? "active" : ""}`} onClick={() => setPage(idx + 1)}>{String(idx + 1).padStart(2, "0")}</button>
                              ))}
                              <button className="ng-page-num" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>›</button>
                            </div>
                          </div>
                        </div>

                        
          </>
        )}
{tab === "users" && (
          <>
            <form className="ng-panel" onSubmit={submitUser}>
              <span className="ng-eyebrow">{editingUserId ? "Update User" : "Create User"}</span>
              <div className="ng-grid-form-3" style={{ marginTop: 16 }}>
                <div className="ng-field"><label>Name</label><input className="ng-input" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required /></div>
                <div className="ng-field"><label>Email</label><input className="ng-input" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required /></div>
                <div className="ng-field"><label>Phone</label><input className="ng-input" value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} /></div>
                {!editingUserId && <div className="ng-field"><label>Password</label><input className="ng-input" type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} required /></div>}
                <div className="ng-field"><label>Role</label><select className="ng-select" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>{["user", "admin", "product manager", "order manager", "inventory staff"].map((roleName) => <option key={roleName}>{roleName}</option>)}</select></div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="ng-btn ng-btn-primary">{editingUserId ? "Update User" : "Create User"}</button>
                {editingUserId && <button className="ng-btn" type="button" onClick={() => { setEditingUserId(null); setUserForm(emptyUserForm); }}>Cancel</button>}
              </div>
            </form>
            <div className="ng-table-card" style={{ marginBottom: 22 }}>
              <div className="ng-section-title">
                <h2>Users</h2>
                <Pill tone="olive">{customerUsers.length} customers</Pill>
              </div>
              <table className="ng-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
                {renderUserRows(customerUsers, "No customer users found.")}
              </table>
            </div>

            <div className="ng-table-card">
              <div className="ng-section-title">
                <h2>Special Staff</h2>
                <Pill tone="gold">{staffUsers.length} members</Pill>
              </div>
              <table className="ng-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
                {renderUserRows(staffUsers, "No special staff found.")}
              </table>
            </div>
          </>
        )}

        {tab === "coupons" && (
          <>
            <form className="ng-panel" onSubmit={submitCoupon}>
              <span className="ng-eyebrow">{editingCouponId ? "Update Coupon" : "Create Coupon"}</span>
              <div className="ng-grid-form-4" style={{ marginTop: 16 }}>
                <div className="ng-field"><label>Code</label><input className="ng-input" value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })} required /></div>
                <div className="ng-field"><label>Type</label><select className="ng-select" value={couponForm.discountType} onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}><option value="percent">Percent</option><option value="flat">Flat</option></select></div>
                <div className="ng-field"><label>Value</label><input className="ng-input" type="number" value={couponForm.discountValue} onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })} required /></div>
                <div className="ng-field"><label>Expire At</label><input className="ng-input" type="date" value={couponForm.expireAt} onChange={(e) => setCouponForm({ ...couponForm, expireAt: e.target.value })} /></div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="ng-btn ng-btn-primary"><Percent size={15} /> {editingCouponId ? "Update Coupon" : "Create Coupon"}</button>
                {editingCouponId && <button className="ng-btn" type="button" onClick={() => { setEditingCouponId(null); setCouponForm(emptyCoupon); }}>Cancel</button>}
              </div>
            </form>
            <div className="ng-table-card">
              <table className="ng-table">
                <thead><tr><th>Code</th><th>Discount</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>{admin.coupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td style={{ fontWeight: 600 }}>{coupon.code}</td>
                    <td>{coupon.discountValue}{coupon.discountType === "percent" ? "%" : ""}</td>
                    <td style={{ textTransform: "capitalize" }}>{coupon.discountType}</td>
                    <td><Pill tone={coupon.active ? "olive" : "rose"}>{coupon.active ? "Active" : "Inactive"}</Pill></td>
                    <td>
                      <div className="ng-actions">
                        <button className="ng-btn" onClick={() => { setEditingCouponId(coupon._id); setCouponForm({ code: coupon.code || "", discountType: coupon.discountType || "percent", discountValue: coupon.discountValue || "", minOrderAmount: coupon.minOrderAmount || 0, expireAt: coupon.expireAt?.slice?.(0, 10) || "", active: coupon.active !== false }); }}><Edit size={13} /> Edit</button>
                        <button className="ng-btn ng-btn-danger" onClick={() => dispatch(deleteCoupon(coupon._id))}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )}

        {tab === "newsletter" && (
          <div className="ng-table-card">
            <table className="ng-table">
              <thead><tr><th>Email</th><th>Date</th><th>Action</th></tr></thead>
              <tbody>{subscribers.map((item) => (
                <tr key={item._id}>
                  <td>{item.email}</td>
                  <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</td>
                  <td><button className="ng-btn ng-btn-danger" onClick={() => dispatch(DeleteSubscriber(item._id))}><Trash2 size={13} /> Remove</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {tab === "analytics" && (
          <>
            <div className="ng-split-2">
              <div className="ng-panel">
                <span className="ng-eyebrow">Customer Health</span>
                <Donut segments={userDonutSegments} centerValue={totalUsersCount} centerLabel="Total" />
              </div>
              <div className="ng-panel">
                <span className="ng-eyebrow">Catalog Mix</span>
                <Donut segments={productDonutSegments} centerValue={totalProductsCount} centerLabel="Products" />
              </div>
              <div className="ng-panel">
                <span className="ng-eyebrow">Top Categories</span>
                <div style={{ marginTop: 14 }}>
                  {categoryBreakdown.length === 0 && <p style={{ color: "var(--ng-muted)", fontSize: 13 }}>No products yet.</p>}
                  {categoryBreakdown.map(([cat, count]) => <BarRow key={cat} label={cat} value={count} max={maxCategoryCount} color="var(--ng-gold)" />)}
                </div>
              </div>
            </div>

            <div className="ng-panel">
              <span className="ng-eyebrow">All Metrics</span>
              <div className="ng-grid-3" style={{ marginTop: 14 }}>
                {Object.entries({ ...(admin.userAnalytics || {}), ...(admin.productAnalytics || {}) }).map(([key, value]) => (
                  <MetricCard key={key} label={key.replace(/([A-Z])/g, " $1")} value={value} Icon={BarChart3} />
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "orders" && (
          <div className="ng-table-card">
            <div className="ng-section-title">
              <h2>Orders</h2>
              <Pill tone="olive">{admin.orders.length} total</Pill>
            </div>
            <table className="ng-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {admin.orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderNumber || order._id}</td>
                    <td>{order.user?.name || order.user?.email || "-"}</td>
                    <td>{money(order.totalPrice || order.totalAmount)}</td>
                    <td><Pill tone={order.paymentStatus === "paid" ? "olive" : "gold"}>{order.paymentStatus || "pending"}</Pill></td>
                    <td style={{ textTransform: "capitalize" }}>{order.orderStatus || "placed"}</td>
                    <td>
                      <select
                        className="ng-select"
                        value={order.orderStatus || "placed"}
                        onChange={(event) => dispatch(updateAdminOrderStatus({ id: order._id, data: { orderStatus: event.target.value } })).then(() => dispatch(fetchAdminOrders()))}
                      >
                        {["placed", "packed", "shipped", "out for delivery", "delivered", "cancelled"].map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {admin.orders.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--ng-muted)", padding: 30 }}>No orders found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}