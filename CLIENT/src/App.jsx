import { useEffect, useLayoutEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { GetProfile } from "./features/auth/authThunk";
import { GetCart as fetchCart } from "./features/cart/cartThunk";
import { GetWishlist as fetchWishlist } from "./features/wishlist/wishlistThunk";
import { Account } from "./pages/Account";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AuthPage } from "./pages/AuthPage";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { OrderDetails } from "./pages/OrderDetails";
import { Orders } from "./pages/Orders";
import { Returns } from "./pages/Returns";
import { PaymentStatus } from "./pages/PaymentStatus";
import { ProductDetails } from "./pages/ProductDetails";
import { Products } from "./pages/Products";
import { ResetPassword } from "./pages/ResetPassword";
import { Wishlist } from "./pages/Wishlist";
import { About } from "./pages/About";
import { DeliveryPolicy } from "./pages/DeliveryPolicy";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsConditions } from "./pages/TermsConditions";
import { RefundPolicy } from "./pages/RefundPolicy";

function Shell({ children }) {
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const isPrivileged = ["admin", "product manager", "inventory staff", "order manager"].includes(user?.role);

  if (isPrivileged && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      {!location.pathname.startsWith("/admin") && <Navbar />}
      {children}
      {!location.pathname.startsWith("/admin") && <Footer />}
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(GetProfile()).then((result) => {
      if (GetProfile.fulfilled.match(result)) {
        dispatch(fetchCart());
        dispatch(fetchWishlist());
      }
    });
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Shell><Home /></Shell>} />
      <Route path="/products" element={<Shell><Products /></Shell>} />
      <Route path="/mens" element={<Shell><Products gender="men" /></Shell>} />
      <Route path="/womens" element={<Shell><Products gender="women" /></Shell>} />
      <Route path="/kids" element={<Shell><Products gender="kids" /></Shell>} />
      <Route path="/sale" element={<Shell><Products collection="sale" /></Shell>} />
      <Route path="/product/:slug" element={<Shell><ProductDetails /></Shell>} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:resetToken" element={<ResetPassword />}/>
      <Route element={<ProtectedRoute />}>
        <Route path="/account" element={<Shell><Account /></Shell>} />
        <Route path="/wishlist" element={<Shell><Wishlist /></Shell>} />
        <Route path="/cart" element={<Shell><Cart /></Shell>} />
        <Route path="/checkout" element={<Shell><Checkout /></Shell>} />
        <Route path="/orders" element={<Shell><Orders /></Shell>} />
        <Route path="/orders/:id" element={<Shell><OrderDetails /></Shell>} />
        <Route path="/returns" element={<Shell><Returns /></Shell>} />
        <Route path="/payment/:status" element={<Shell><PaymentStatus /></Shell>} />
      </Route>
      <Route element={<ProtectedRoute roles={["admin", "product manager", "inventory staff", "order manager"]} />}>
        <Route path="/admin/*" element={<Shell><AdminDashboard /></Shell>} />
      </Route>

      <Route path="/about" element={<About />} />
<Route path="/delivery-policy" element={<DeliveryPolicy/>} />
<Route path="/privacy-policy" element={<PrivacyPolicy />} />
<Route path="/refund-policy" element={<RefundPolicy />} />
<Route path="/terms" element={<TermsConditions />} />
      <Route path="*" element={<Shell><NotFound /></Shell>} />
      </Routes>
    </>
  );
}
