import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ResetPassword as ResetPasswordThunk,
} from "../features/auth/authThunk";

import {
  ClearMessage,
} from "../features/auth/authSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../hooks/reduxHooks";

export function ResetPassword() {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { resetToken } = useParams();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const {
    loading,
    message,
    error,
  } = useAppSelector((state) => state.auth);

  useEffect(() => {

    if (message) {

      toast.success(message);

      dispatch(ClearMessage());

      navigate("/auth");

    }

  }, [message, dispatch, navigate]);

  useEffect(() => {

    if (error) {

      toast.error(error);

      dispatch(ClearMessage());

    }

  }, [error, dispatch]);

  const submit = async (e) => {

    e.preventDefault();

    if (!password.trim()) {

      return toast.error("Password is required");

    }

    if (password.length < 6) {

      return toast.error("Password must be at least 6 characters");

    }

    if (password !== confirmPassword) {

      return toast.error("Passwords do not match");

    }

    dispatch(

      ResetPasswordThunk({

        resetToken,

        password,

      })

    );

  };

  return (

    <main
      className="page"
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
        padding: 20,
      }}
    >

      <form
        className="card fade-up"
        style={{
          width: "min(460px,100%)",
          padding: 32,
        }}
        onSubmit={submit}
      >

        <Link
          className="brand"
          to="/"
        >
          NextGen
        </Link>

        <h1
          className="title"
          style={{
            marginTop: 28,
          }}
        >
          Reset Password
        </h1>

        <p
          className="subtitle"
          style={{
            marginBottom: 24,
          }}
        >
          Enter your new password below.
        </p>

        <div className="field">

          <label>
            New Password
          </label>

          <input
            className="input"
            type="password"
            value={password}
            placeholder="Minimum 6 characters"
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

        </div>

        <div
          className="field"
          style={{
            marginTop: 16,
          }}
        >

          <label>
            Confirm Password
          </label>

          <input
            className="input"
            type="password"
            value={confirmPassword}
            placeholder="Re-enter password"
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

        </div>

        <button
          className="btn btn-primary"
          style={{
            width: "100%",
            marginTop: 24,
          }}
          disabled={loading}
        >

          {loading
            ? "Updating..."
            : "Reset Password"}

        </button>

      </form>

    </main>

  );

}