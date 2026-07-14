import { useEffect, useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { ForgotPassword as ForgotPasswordThunk } from "../features/auth/authThunk";
import { ClearMessage } from "../features/auth/authSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../hooks/reduxHooks";

export function ForgotPassword() {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const {
    loading,
    message,
    error,
  } = useAppSelector((state) => state.auth);

  useEffect(() => {

    if (message) {

      toast.success(message);

      setSent(true);

      dispatch(ClearMessage());

    }

  }, [message]);

  useEffect(() => {

    if (error) {

      toast.error(error);

      dispatch(ClearMessage());

    }

  }, [error]);

  const submit = async (e) => {

    e.preventDefault();

    if (!email.trim()) {

      return toast.error("Please enter your email address.");

    }

    const emailRegex =
      /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(email)) {

      return toast.error("Please enter a valid email.");

    }

    dispatch(
      ForgotPasswordThunk(email)
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

      <div
        className="card fade-up"
        style={{
          width: "min(480px,100%)",
          padding: 36,
        }}
      >

        <Link
          className="brand"
          to="/"
        >
          NextGen
        </Link>

        {!sent ? (

          <>
            <h1
              className="title"
              style={{
                marginTop: 28,
              }}
            >
              Forgot Password?
            </h1>

            <p
              className="subtitle"
              style={{
                marginTop: 8,
              }}
            >
              Enter your registered email address and we'll send you a secure password reset link.
            </p>

            <form
              onSubmit={submit}
              style={{
                marginTop: 28,
              }}
            >

              <div className="field">

                <label>Email Address</label>

                <div
                  style={{
                    position: "relative",
                  }}
                >

                  <Mail
                    size={18}
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#888",
                    }}
                  />

                  <input
                    className="input"
                    style={{
                      paddingLeft: 44,
                    }}
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="you@example.com"
                  />

                </div>

              </div>

              <button
                className="btn btn-primary"
                style={{
                  width: "100%",
                  marginTop: 22,
                }}
                disabled={loading}
              >

                {loading
                  ? "Sending..."
                  : "Send Reset Link"}

              </button>

            </form>

            <p
              style={{
                marginTop: 22,
                textAlign: "center",
              }}
            >
              Remember your password?{" "}
              <Link
                to="/auth"
                style={{
                  fontWeight: 600,
                }}
              >
                Sign In
              </Link>
            </p>

          </>

        ) : (

          <div
            style={{
              textAlign: "center",
              paddingTop: 12,
            }}
          >

            <CheckCircle2
              size={70}
              color="#16a34a"
            />

            <h2
              className="title"
              style={{
                marginTop: 22,
              }}
            >
              Reset Link Sent
            </h2>

            <p
              className="subtitle"
              style={{
                marginTop: 12,
                lineHeight: 1.8,
              }}
            >
              We've sent a password reset link to
              <br />

              <strong>
                {email}
              </strong>

              <br /><br />

              Please check your inbox.
              <br />

              If you don't see it, please check your Spam folder.
            </p>

            <button
              className="btn btn-primary"
              style={{
                width: "100%",
                marginTop: 28,
              }}
              onClick={() =>
                setSent(false)
              }
            >
              Send Again
            </button>

            <Link
              to="/auth"
              className="btn btn-secondary"
              style={{
                width: "100%",
                marginTop: 12,
              }}
            >
              Back to Login
            </Link>

          </div>

        )}

      </div>

    </main>

  );

}