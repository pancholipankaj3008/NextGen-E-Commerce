import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ResetPassword as ResetPasswordThunk } from "../features/auth/authThunk";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

export function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const submit = async (event) => {
    event.preventDefault();
    const result = await dispatch(ResetPasswordThunk({ resetToken: token, newPassword }));
    if (ResetPasswordThunk.fulfilled.match(result)) navigate("/auth");
  };

  return (
    <main className="page" style={{ display: "grid", placeItems: "center", minHeight: "100vh", padding: 20 }}>
      <form className="card fade-up" style={{ width: "min(460px, 100%)", padding: 32 }} onSubmit={submit}>
        <Link className="brand" to="/">NextGen</Link>
        <h1 className="title" style={{ marginTop: 28 }}>Choose a new password.</h1>
        <div className="field" style={{ marginTop: 22 }}>
          <label>New Password</label>
          <input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 6 characters" />
        </div>
        <button className="btn btn-primary" style={{ width: "100%", marginTop: 18 }} disabled={loading}>{loading ? "Updating..." : "Reset Password"}</button>
      </form>
    </main>
  );
}
