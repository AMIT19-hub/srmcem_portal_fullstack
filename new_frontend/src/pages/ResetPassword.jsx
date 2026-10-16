import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { resetPassword } from "../services/authService";
import { errorText } from "../utils/data";

const normalizeEmail = (email) => email.trim().toLowerCase();
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location.state?.email || "";
  const [form, setForm] = useState({
    email: initialEmail,
    otp: "",
    newPassword: "",
  });
  const otpRequestedFor =
    location.state?.otpRequestedFor ||
    (location.state?.requestMessage && initialEmail
      ? normalizeEmail(initialEmail)
      : "");
  const requestMessage = location.state?.requestMessage || "";
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const resetLock = useRef(false);
  const normalizedEmail = normalizeEmail(form.email);
  const canReset = Boolean(
    otpRequestedFor && otpRequestedFor === normalizedEmail,
  );

  const submit = async (event) => {
    event.preventDefault();
    if (resetLock.current || busy) return;
    const email = normalizeEmail(form.email);
    if (!validEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!otpRequestedFor || otpRequestedFor !== email) {
      setForm((current) => ({ ...current, otp: "" }));
      setError(
        "Request a new OTP for this email before resetting your password.",
      );
      return;
    }
    if (form.newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    resetLock.current = true;
    setBusy(true);
    setError("");
    try {
      await resetPassword({ ...form, email });
      navigate("/login", {
        state: { message: "Password reset successfully. Please log in." },
      });
    } catch (requestError) {
      setError(errorText(requestError, "Unable to reset your password."));
    } finally {
      resetLock.current = false;
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl p-6 sm:py-12">
      <h1 className="text-3xl font-bold text-[#102747]">Reset password</h1>
      <p className="mt-2 text-slate-600">
        Enter the OTP and a new password.
      </p>
      <div className="mt-5 space-y-3">
        <ErrorMessage message={error} />
        {requestMessage && (
          <p
            role="status"
            className="border-l-4 border-[#102747] bg-slate-50 px-4 py-3 text-sm text-slate-700"
          >
            {requestMessage}
          </p>
        )}
      </div>
      <form
        onSubmit={submit}
        className="mt-6 space-y-4 border border-slate-200 bg-white p-6 shadow-sm"
        aria-busy={busy}
      >
        <label
          htmlFor="reset-email"
          className="block text-sm font-semibold text-[#102747]"
        >
          Email
          <input
            id="reset-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            readOnly
            aria-readonly="true"
            className="mt-2 w-full rounded border border-slate-300 bg-slate-50 px-3 py-3 text-slate-600"
          />
        </label>

        <label
          htmlFor="reset-otp"
          className="block text-sm font-semibold text-[#102747]"
        >
          OTP
          <input
            id="reset-otp"
            name="otp"
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            value={form.otp}
            onChange={(event) => {
              setForm((current) => ({ ...current, otp: event.target.value }));
              setError("");
            }}
            disabled={!canReset || busy}
            className="mt-2 w-full rounded border border-slate-300 px-3 py-3 focus:border-[#102747] disabled:bg-slate-100"
          />
        </label>
        <label
          htmlFor="reset-new-password"
          className="block text-sm font-semibold text-[#102747]"
        >
          New password
          <input
            id="reset-new-password"
            name="newPassword"
            type="password"
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            value={form.newPassword}
            onChange={(event) => {
              setForm((current) => ({
                ...current,
                newPassword: event.target.value,
              }));
              setError("");
            }}
            disabled={busy}
            className="mt-2 w-full rounded border border-slate-300 px-3 py-3 focus:border-[#102747] disabled:bg-slate-100"
          />
        </label>
        <button
          type="submit"
          disabled={busy || !canReset}
          className="rounded bg-[#102747] px-4 py-3 font-bold text-white transition hover:bg-[#0c1f38] disabled:opacity-60"
        >
          {busy ? "Saving…" : "Reset password"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        <Link
          className="font-semibold text-[#102747] hover:text-[#c6283d]"
          to="/forgot-password"
        >
          Request another OTP
        </Link>
      </p>
    </section>
  );
}
