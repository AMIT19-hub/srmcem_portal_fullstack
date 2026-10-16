import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import { verifyOtp } from '../services/authService';
import { errorText } from '../utils/data';

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: location.state?.email || '', otp: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { data } = await verifyOtp(form);
      setMessage(typeof data === 'string' ? data : data?.message || 'Email verified. You can now log in.');
      window.setTimeout(() => navigate('/login'), 900);
    } catch (e) {
      setError(errorText(e, 'Unable to verify the OTP.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl p-6 sm:py-12">
      <h1 className="text-3xl font-bold">Verify your email</h1>
      <p className="mt-2 text-slate-600">Enter the OTP sent to your email to complete registration.</p>
      <div className="mt-5">
        <ErrorMessage message={error} />
        {message && <p role="status" className="mt-3 text-emerald-800">{message}</p>}
      </div>
      <form onSubmit={submit} className="mt-6 space-y-4 border bg-white p-6">
        <label className="block text-sm font-semibold">
          Email
          <input
            type="email"
            required
            readOnly
            value={form.email}
            className="mt-2 w-full rounded border bg-slate-50 p-3 text-slate-600"
          />
        </label>
        <label className="block text-sm font-semibold">
          OTP
          <input
            required
            autoComplete="one-time-code"
            value={form.otp}
            onChange={(event) => setForm({ ...form, otp: event.target.value })}
            className="mt-2 w-full rounded border p-3"
          />
        </label>
        <button disabled={busy} className="rounded bg-emerald-700 px-4 py-3 font-bold text-white disabled:opacity-60">
          {busy ? 'Verifying…' : 'Verify OTP'}
        </button>
      </form>
      <p className="mt-4 text-sm"><Link className="text-emerald-700" to="/login">Back to login</Link></p>
    </section>
  );
}
