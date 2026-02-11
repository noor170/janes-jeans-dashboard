import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

type Method = 'sms' | 'email';

export default function OtpVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId') || '';
  const initialMethod = (searchParams.get('method') || 'sms') as Method;
  const destination = searchParams.get('to') || '';

  const [method, setMethod] = useState<Method>(initialMethod);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes

  useEffect(() => {
    // start countdown
    const t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!orderId) return;
    // request OTP once on mount
    requestOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, method]);

  function formatTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  async function requestOtp() {
    if (!orderId) return;
    setLoading(true);
    setMessage('');
    try {
      await fetch(`/api/orders/${orderId}/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: destination, method })
      });
      setSecondsLeft(300);
      setMessage(`OTP sent via ${method.toUpperCase()}`);
    } catch (e) {
      setMessage('Failed to request OTP');
    } finally { setLoading(false); }
  }

  async function verifyOtp() {
    if (!orderId) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/orders/${orderId}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: destination, otp })
      });
      if (res.ok) {
        setMessage('OTP verified — order confirmed');
        setTimeout(() => navigate(`/orders/${orderId}`), 800);
      } else {
        const body = await res.json();
        setMessage(body?.message || 'Invalid or expired OTP');
      }
    } catch (e) {
      setMessage('Verification failed');
    } finally { setLoading(false); }
  }

  async function skipVerification() {
    if (!orderId) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/orders/${orderId}/skip-verify`, { method: 'POST' });
      if (res.ok) {
        setMessage('Order finalized without OTP');
        setTimeout(() => navigate(`/orders/${orderId}`), 800);
      } else {
        const body = await res.json();
        setMessage(body?.message || 'Unable to skip verification');
      }
    } catch (e) {
      setMessage('Skip verification failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white p-6">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-2">Verify your order</h1>
        <p className="text-sm text-slate-500 mb-4">Order: <span className="font-medium">{orderId}</span></p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Delivery contact</label>
          <div className="flex items-center gap-3">
            <div className="flex-1 p-3 bg-slate-50 rounded-md border border-slate-100">{destination || 'Not provided'}</div>
            <div className="flex gap-2">
              <button onClick={() => setMethod('sms')} className={`px-3 py-1 rounded ${method==='sms'?'bg-sky-600 text-white':'bg-slate-100'}`}>SMS</button>
              <button onClick={() => setMethod('email')} className={`px-3 py-1 rounded ${method==='email'?'bg-sky-600 text-white':'bg-slate-100'}`}>Email</button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Enter OTP</label>
          <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0,6))} placeholder="6-digit code"
                 className="w-full p-3 text-lg text-center tracking-widest rounded-md border border-slate-200" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-slate-600">Expires in <span className="font-medium">{formatTime(secondsLeft)}</span></div>
          <div className="flex gap-2">
            <button disabled={loading} onClick={requestOtp} className="px-3 py-2 bg-white border rounded-md">Resend</button>
            <button disabled={loading} onClick={verifyOtp} className="px-4 py-2 bg-sky-600 text-white rounded-md">Verify</button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <button onClick={() => navigate(-1)} className="text-sm text-slate-600">Back</button>
          <button onClick={skipVerification} disabled={loading} className="text-sm text-rose-600">Skip verification</button>
        </div>

        {message && <div className="mt-4 p-3 bg-slate-50 rounded-md text-sm">{message}</div>}
      </div>
    </div>
  );
}
