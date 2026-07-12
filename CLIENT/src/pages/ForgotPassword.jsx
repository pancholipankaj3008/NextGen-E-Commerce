import { useState } from "react";
import { Link } from "react-router-dom";
import { ForgotPassword as ForgotPasswordThunk } from "../features/auth/authThunk";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  return (
    <main className="page" style={{ display: "grid", placeItems: "center", minHeight: "100vh", padding: 20 }}>
      <form className="card fade-up" style={{ width: "min(460px, 100%)", padding: 32 }} onSubmit={(e) => { e.preventDefault(); dispatch(ForgotPasswordThunk(email)); }}>
        <Link className="brand" to="/">NextGen</Link>
        <h1 className="title" style={{ marginTop: 28 }}>Reset your password.</h1>
        <p className="subtitle">Enter your account email and we will send a secure reset link.</p>
        <div className="field" style={{ marginTop: 22 }}>
          <label>Email Address</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@nextgen.com" />
        </div>
        <button className="btn btn-primary" style={{ width: "100%", marginTop: 18 }} disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</button>
      </form>
    </main>
  );
}
