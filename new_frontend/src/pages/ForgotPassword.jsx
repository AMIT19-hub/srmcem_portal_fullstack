import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import { forgotPassword } from '../services/authService';
import { errorText } from '../utils/data';

const genericResponse = 'If the account exists, a password reset OTP will be sent.';
const normalizeEmail = (email) => email.trim().toLowerCase();
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const requestLock = useRef(false);

  const submit = async (event) => {
    event.preventDefault();
    const normalizedEmail = normalizeEmail(email);
    setEmail(normalizedEmail);
    if (!validEmail(normalizedEmail)) {
      setError('Enter a valid email address.');
      return;
    }
    if (requestLock.current) return;

    requestLock.current = true;
    setBusy(true);
    setError('');
    try {
      const { data } = await forgotPassword({ email: normalizedEmail });
      const message = typeof data === 'string' ? data : data?.message || genericResponse;
      navigate('/reset-password', {
        state: { email: normalizedEmail, otpRequestedFor: normalizedEmail, requestMessage: message },
      });
    } catch (requestError) {
      setError(errorText(requestError, 'Unable to request a password reset.'));
    } finally {
      requestLock.current = false;
      setBusy(false);
    }
  };

  return <section className="mx-auto max-w-xl p-6 sm:py-12">
    <h1 className="text-3xl font-bold text-[#102747]">Forgot password</h1>
    <p className="mt-2 text-slate-600">Request a password reset OTP by email.</p>
    <div className="mt-5"><ErrorMessage message={error} /></div>
    <form onSubmit={submit} className="mt-6 space-y-4 border border-slate-200 bg-white p-6 shadow-sm">
      <label htmlFor="forgot-email" className="block text-sm font-semibold text-[#102747]">Email
        <input id="forgot-email" name="email" type="email" required autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(''); }} className="mt-2 w-full rounded border border-slate-300 px-3 py-3 focus:border-[#102747]" />
      </label>
      <button type="submit" disabled={busy} className="rounded bg-[#102747] px-4 py-3 font-bold text-white transition hover:bg-[#0c1f38] disabled:opacity-60">
        {busy ? 'Sending…' : 'Send reset OTP'}
      </button>
    </form>
    <p className="mt-4 text-sm"><Link className="font-semibold text-[#102747] hover:text-[#c6283d]" to="/login">Back to login</Link></p>
  </section>;
}
